import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { gitRepoTool } from "./tools/git-repo";
import { gitRepoSummaryTool } from "./tools/git-repo-summary";
import { gitRepoVersionsTool } from "./tools/git-repo-versions";

export default function (pi: ExtensionAPI) {
  // Register flags
  pi.registerFlag("repo-base-dir", {
    description: "Global base directory for git repository checkouts. Overrides settings.json.",
    type: "string",
  });

  // Register tools
  pi.registerTool(gitRepoTool(pi));
  pi.registerTool(gitRepoSummaryTool(pi));
  pi.registerTool(gitRepoVersionsTool(pi));
}
