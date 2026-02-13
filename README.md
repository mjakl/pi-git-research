# Pi git Research

**Tools for researching and exploring Git repositories with Pi agent. Clone, update, and summarize codebases on the fly.**

## Why pi git Research

**Codebase Exploration** — Quickly download and orient yourself in a new repository. Perfect for researching dependencies, libraries, or competitor codebases.

**Smart Defaults** — Uses shallow clones (`--depth 1`) and hard resets to keep research fast and your workspace clean.

**Automated Summarization** — Automatically extracts directory structure, README content, and latest commit info to give you immediate context.

## Install

### Option 1: Install via Pi

```bash
pi install git:github.com/mjakl/pi-git-research
```

### Option 2: Manual Installation

Clone this repository into your project-local or global Pi extensions directory:

```bash
cd .pi/extensions # or ~/.pi/agent/extensions
git clone https://github.com/mjakl/pi-git-research.git
```

## Configuration

You can configure where repositories are checked out.

**Option 1: CLI Flag**
```bash
pi --repo-base-dir ~/Projects/research
```

**Option 2: settings.json**
Add this to your global or project `settings.json`:
```json
{
  "gitResearch": {
    "baseDir": "~/Projects/research"
  }
}
```

If not configured, repositories are cloned into your current working directory.

## Tools

### git_repo
Clone or update a git repository for research.
- `url`: Repository URL (supports GitHub shorthands like `user/repo`).
- `branch`: (Optional) Specific branch or tag.
- `shallow`: (Optional) Use shallow clone (default: `true`).

### git_repo_summary
Get a quick overview of a cloned repository.
- `path`: Path to the local repository.
- `depth`: (Optional) Directory tree depth (default: `2`).

### git_repo_versions
List branches and tags available in a repository (local or remote).

## Skills

### explore-repo
A high-level skill that coordinates the tools to download, summarize, and explain a repository in one go.

```bash
/explore-repo https://github.com/mariozechner/pi-coding-agent
```

## Comparison to Built-in Tools

| Feature | Built-in Bash | This Extension |
|---------|---------------|----------------|
| Cloning | Manual `git clone` | Automatic normalization & updating |
| Updates | Manual fetch/reset | One-call hard reset & clean |
| Context | None | Automatic README & tree extraction |
| Workflow | Multiple steps | Integrated `explore-repo` skill |

## License

MIT
