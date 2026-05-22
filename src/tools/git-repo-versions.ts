import type { ExtensionAPI, ToolDefinition } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import * as path from "node:path";

export const gitRepoVersionsTool = (pi: ExtensionAPI): ToolDefinition => ({
  name: "git_repo_versions",
  label: "List Git Repository Versions",
  description: "List branches and tags available in a repository. Can check a remote URL or a local path.",
  parameters: Type.Object({
    url: Type.Optional(Type.String({ description: "The URL of the git repository to check remote versions." })),
    path: Type.Optional(Type.String({ description: "Path to a local repository." })),
  }),
  async execute(toolCallId, params, signal, onUpdate, ctx) {
    const { url, path: localPath } = params;

    if (url) {
      onUpdate?.({ content: [{ type: "text", text: `Fetching remote versions for ${url}...` }] });
      const result = await pi.exec("git", ["ls-remote", "--heads", "--tags", url], { signal });
      if (result.code !== 0) {
        return { content: [{ type: "text", text: `Error fetching remote versions: ${result.stderr}` }], isError: true };
      }

      const lines = result.stdout.trim().split("\n");
      const branches = lines.filter(l => l.includes("refs/heads/")).map(l => l.split("refs/heads/")[1]);
      const tags = lines.filter(l => l.includes("refs/tags/")).map(l => l.split("refs/tags/")[1].replace("^{}", ""));
      const uniqueTags = Array.from(new Set(tags));

      let output = `Remote Versions for ${url}:\n\n`;
      output += `Branches:\n  ${branches.join("\n  ")}\n\n`;
      output += `Tags:\n  ${uniqueTags.join("\n  ")}`;

      return {
        content: [{ type: "text", text: output }],
        details: { url, branches, tags: uniqueTags }
      };
    } else if (localPath) {
      const fullPath = path.resolve(ctx.cwd, localPath);
      onUpdate?.({ content: [{ type: "text", text: `Fetching local/remote versions for ${fullPath}...` }] });
      
      const branchResult = await pi.exec("git", ["branch", "-a"], { cwd: fullPath, signal });
      const tagResult = await pi.exec("git", ["tag"], { cwd: fullPath, signal });

      let output = `Versions for repository at ${fullPath}:\n\n`;
      output += `Branches:\n${branchResult.stdout}\n`;
      output += `Tags:\n${tagResult.stdout}`;

      return {
        content: [{ type: "text", text: output }],
        details: { path: fullPath }
      };
    } else {
      return { content: [{ type: "text", text: "Either 'url' or 'path' must be provided." }], isError: true };
    }
  }
});
