import type { ExtensionAPI, ToolDefinition } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { StringEnum } from "@earendil-works/pi-ai";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { getBaseDir } from "../utils";

export const gitRepoTool = (pi: ExtensionAPI): ToolDefinition => ({
  name: "git_repo",
  label: "Git Repository Manager",
  description: "Clone or update a git repository for research. Supports shallow clones and hard resets for updates.",
  parameters: Type.Object({
    url: Type.String({ description: "The URL of the git repository" }),
    base_dir: Type.Optional(Type.String({ description: "Base directory for checkouts. Overrides the global configuration if provided." })),
    target_dir: Type.Optional(Type.String({ description: "Target directory (relative to base_dir). Defaults to repo name." })),
    shallow: Type.Optional(Type.Boolean({ description: "Whether to perform a shallow clone. Default: true.", default: true })),
    branch: Type.Optional(Type.String({ description: "Specific branch or tag to clone/checkout." })),
    protocol: Type.Optional(
      StringEnum(["https", "ssh"] as const, {
        description: "Preferred protocol if URL needs normalization (GitHub only).",
        default: "https",
      }),
    ),
  }),
  async execute(toolCallId, params, signal, onUpdate, ctx) {
    let { url, base_dir, target_dir, shallow = true, branch, protocol = "https" } = params;

    const effectiveBaseDir = base_dir ? path.resolve(ctx.cwd, base_dir) : getBaseDir(pi, ctx);
    
    if (!existsSync(effectiveBaseDir)) {
      await fs.mkdir(effectiveBaseDir, { recursive: true });
    }

    // Basic GitHub URL normalization
    if (url.includes("github.com") && !url.startsWith("https://") && !url.startsWith("git@") && !url.startsWith("git://")) {
      const parts = url.split("github.com/")[1];
      if (parts) {
        if (protocol === "https") {
          url = `https://github.com/${parts}${parts.endsWith(".git") ? "" : ".git"}`;
        } else {
          url = `git@github.com:${parts}${parts.endsWith(".git") ? "" : ".git"}`;
        }
      }
    } else if (!url.includes("://") && !url.startsWith("git@") && url.split("/").length === 2) {
      // Assume user/repo on GitHub
      if (protocol === "https") {
        url = `https://github.com/${url}.git`;
      } else {
        url = `git@github.com:${url}.git`;
      }
    }

    const repoName = url.split("/").pop()?.replace(".git", "") || "repo";
    const dest = target_dir ? path.resolve(effectiveBaseDir, target_dir) : path.resolve(effectiveBaseDir, repoName);

    const isDir = await fs.stat(dest).then(s => s.isDirectory()).catch(() => false);
    const isGit = await fs.access(path.join(dest, ".git")).then(() => true).catch(() => false);

    if (isDir && isGit) {
      onUpdate?.({ content: [{ type: "text", text: `Repository exists in ${dest}. Updating...` }] });
      
      // Verify it's the same repo
      const remoteUrlResult = await pi.exec("git", ["remote", "get-url", "origin"], { cwd: dest, signal });
      const currentRemote = remoteUrlResult.stdout.trim();
      
      // Simple check (might be improved with URL normalization)
      if (!currentRemote.includes(repoName)) {
         return {
             content: [{ type: "text", text: `Error: Directory ${dest} exists but points to a different remote: ${currentRemote}` }],
             isError: true
         };
      }

      // Fetch
      const fetchArgs = ["fetch"];
      if (shallow) fetchArgs.push("--depth", "1");
      if (branch) {
          fetchArgs.push("origin", branch);
      } else {
          fetchArgs.push("origin");
      }
      
      await pi.exec("git", fetchArgs, { cwd: dest, signal });

      // Reset
      const resetTarget = branch ? `origin/${branch}` : "HEAD";
      await pi.exec("git", ["reset", "--hard", resetTarget], { cwd: dest, signal });
      await pi.exec("git", ["clean", "-fd"], { cwd: dest, signal });

      return {
        content: [{ type: "text", text: `Updated repository in ${dest}` }],
        details: { path: dest, action: "update" },
      };
    } else if (isDir) {
        return {
            content: [{ type: "text", text: `Error: Directory ${dest} exists and is not a git repository.` }],
            isError: true
        };
    } else {
      onUpdate?.({ content: [{ type: "text", text: `Cloning ${url} into ${dest}...` }] });
      const cloneArgs = ["clone"];
      if (shallow) cloneArgs.push("--depth", "1");
      if (branch) cloneArgs.push("--branch", branch);
      cloneArgs.push(url, dest);

      const result = await pi.exec("git", cloneArgs, { signal });
      if (result.code !== 0) {
          return {
              content: [{ type: "text", text: `Clone failed:\n${result.stderr}` }],
              isError: true
          };
      }

      return {
        content: [{ type: "text", text: `Cloned repository into ${dest}` }],
        details: { path: dest, action: "clone" },
      };
    }
  },
});
