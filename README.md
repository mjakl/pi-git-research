# Pi Git Research

**Download, update, and summarize Git repositories from Pi.**

`pi-git-research` gives Pi tools and a skill for researching external repositories without turning every investigation into a manual clone/fetch/reset workflow.

## User Guide

### Why Pi Git Research

Use this package when you want Pi to quickly inspect a repository, dependency, example project, or competitor codebase.

### Features

- **Repository checkout** — clone or update repositories from full URLs or GitHub shorthands such as `user/repo`.
- **Fast defaults** — shallow clones by default for quick research.
- **Clean refreshes** — updates use hard reset and clean semantics so research checkouts stay disposable.
- **Immediate orientation** — repository summaries include tree, README content, and latest commit info.
- **Skill workflow** — the `explore-repo` skill coordinates clone, summary, and explanation in one flow.

### Install

Install from npm:

```bash
pi install npm:@mjakl/pi-git-research
```

Install from git:

```bash
pi install git:github.com/mjakl/pi-git-research
```

Or install from a local checkout:

```bash
pi install /path/to/pi-git-research
```

Package name: `@mjakl/pi-git-research`.

### Quick start

Ask Pi to explore a repository:

```text
/explore-repo https://github.com/mariozechner/pi-coding-agent
```

GitHub shorthands are supported too:

```text
/explore-repo mjakl/pi-subagent
```

You can also ask in natural language:

```text
Clone and summarize github.com/mjakl/pi-subagent so we can inspect its extension structure.
```

### Configuration

You can configure where repositories are checked out.

#### Option 1: CLI flag

```bash
pi --repo-base-dir ~/Projects/research
```

#### Option 2: settings.json

Add this to your global or project `settings.json`:

```json
{
  "gitResearch": {
    "baseDir": "~/Projects/research"
  }
}
```

If not configured, repositories are cloned into your current working directory.

### Workflow tips

- Use a dedicated research directory if you regularly inspect third-party repositories.
- Treat checkouts as disposable; update operations reset and clean the worktree.
- Use `branch` when you need a specific branch or tag instead of the default branch.

---

## Technical Reference

These sections document the tools, skill, and development workflow.

### Tools

#### `git_repo`

Clone or update a git repository for research.

Parameters:

- `url` — repository URL; supports GitHub shorthands like `user/repo`.
- `branch` — optional branch or tag.
- `shallow` — optional boolean; use shallow clone, default `true`.

#### `git_repo_summary`

Get a quick overview of a cloned repository.

Parameters:

- `path` — path to the local repository.
- `depth` — optional directory tree depth, default `2`.

#### `git_repo_versions`

List branches and tags available in a repository, local or remote.

### Skill

#### `explore-repo`

A high-level skill that coordinates the tools to download, summarize, and explain a repository in one go.

```bash
/explore-repo https://github.com/mariozechner/pi-coding-agent
```

### Comparison to built-in tools

| Feature | Built-in Bash | This Extension |
|---------|---------------|----------------|
| Cloning | Manual `git clone` | Automatic normalization and updating |
| Updates | Manual fetch/reset | One-call hard reset and clean |
| Context | None | Automatic README and tree extraction |
| Workflow | Multiple steps | Integrated `explore-repo` skill |

### Local development

Install dependencies:

```bash
npm install
```

Check what would be published:

```bash
npm pack --dry-run
npm publish --dry-run --access public
```

Manual package check:

```bash
pi -e .
```

Smoke-test the extension tools in Pi:

- `git_repo`
- `git_repo_summary`
- `git_repo_versions`

Smoke-test the skill:

```bash
/explore-repo https://github.com/mariozechner/pi-coding-agent
```

## License

MIT
