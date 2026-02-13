---
name: explore-repo
description: Download, summarize, and orient in a git repository. Supports optional branch/tag selection. Use for starting research on a new codebase.
---

# Explore Repository

Download and analyze a repository. Optionally specify a branch or tag.

1. **Check Versions (if needed)**: If the user didn't specify a version but wants to know options, use `git_repo_versions` with the URL.
2. **Clone/Update**: Use `git_repo` with the provided `url`. If `version` is provided, pass it to the `branch` parameter.
3. **Summarize**: Once cloned, use `git_repo_summary` on the resulting path to see the structure and README.
4. **Identify Entry Points**: Based on the summary, find core logic, SDK entry points, or main configuration files.
5. **Explain**: Provide a high-level overview of the repository's purpose, structure, and how to navigate it for the requested research.

**Tips for Research:**
- Use `git_repo_versions` if you need to find a specific release tag (e.g., `v1.2.0`).
- The `git_repo` tool uses shallow clones and hard resets by default to keep things fast and clean.

User arguments:
{{args}}
