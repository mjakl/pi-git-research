import type { ExtensionAPI, ToolDefinition } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import * as path from "node:path";
import * as fs from "node:fs/promises";

export const gitRepoSummaryTool = (pi: ExtensionAPI): ToolDefinition => ({
  name: "git_repo_summary",
  label: "Git Repository Summary",
  description: "Get a quick overview of a cloned repository: top-level files, README, and structure.",
  parameters: Type.Object({
    path: Type.String({ description: "Path to the repository" }),
    depth: Type.Optional(Type.Integer({ description: "Depth of directory tree to show. Default: 2.", default: 2 })),
  }),
  async execute(toolCallId, params, signal, onUpdate, ctx) {
    const fullPath = path.resolve(ctx.cwd, params.path);
    const depth = params.depth ?? 2;

    try {
      const stats = await fs.stat(fullPath);
      if (!stats.isDirectory()) {
        return { content: [{ type: "text", text: "Path is not a directory." }], isError: true };
      }

      // 1. Get tree
      const treeResult = await pi.exec("find", [".", "-maxdepth", depth.toString(), "-not", "-path", "*/.*"], { cwd: fullPath, signal });
      
      // 2. Try to find README
      const files = await fs.readdir(fullPath);
      const readmeFile = files.find(f => f.toLowerCase().startsWith("readme"));
      let readmeContent = "";
      if (readmeFile) {
        const content = await fs.readFile(path.join(fullPath, readmeFile), "utf-8");
        readmeContent = content.split("\n").slice(0, 50).join("\n");
        if (content.split("\n").length > 50) readmeContent += "\n... (truncated)";
      }

      // 3. Get git info
      const branchResult = await pi.exec("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: fullPath, signal });
      const lastCommitResult = await pi.exec("git", ["log", "-1", "--format=%h %s (%cr)"], { cwd: fullPath, signal });

      let output = `Repository Summary: ${fullPath}\n`;
      output += `Current Branch: ${branchResult.stdout.trim()}\n`;
      output += `Last Commit: ${lastCommitResult.stdout.trim()}\n\n`;
      
      if (readmeFile) {
        output += `--- ${readmeFile} (first 50 lines) ---\n${readmeContent}\n\n`;
      }
      
      output += `--- Directory Structure (depth ${depth}) ---\n${treeResult.stdout}`;

      return {
        content: [{ type: "text", text: output }],
        details: { path: fullPath }
      };
    } catch (err: any) {
      return { content: [{ type: "text", text: `Error summarizing repo: ${err.message}` }], isError: true };
    }
  }
});
