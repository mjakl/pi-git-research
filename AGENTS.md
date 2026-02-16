# AGENTS.md

Simple guidance for coding agents working in this repository.

## Repository setup

- Requirements: Node.js + npm + git
- Install dependencies:

```bash
npm install
```

- Check what would be published:

```bash
npm pack --dry-run
npm publish --dry-run --access public
```

## Local validation

- This package is a Pi extension + skill package (entry point: `src/index.ts`, skill in `skills/explore-repo/SKILL.md`).
- Quick manual check with local package:

```bash
pi -e .
```

- Smoke-test the extension tools in Pi:
  - `git_repo`
  - `git_repo_summary`
  - `git_repo_versions`
- Smoke-test the skill:

```bash
/explore-repo https://github.com/mariozechner/pi-coding-agent
```

## Code map

- `src/index.ts` — extension entry point, flag registration, and tool registration
- `src/tools/git-repo.ts` — clone/update workflow (`git_repo`)
- `src/tools/git-repo-summary.ts` — repository summary generation (`git_repo_summary`)
- `src/tools/git-repo-versions.ts` — branch/tag listing (`git_repo_versions`)
- `src/utils.ts` — settings loading and checkout base-dir resolution
- `skills/explore-repo/SKILL.md` — high-level research workflow using the tools
- `README.md` — user-facing docs and installation/configuration

## Commit format (important)

Use the repository's existing style:

- Imperative mood
- Sentence case
- No prefix like `feat:` / `fix:` / `chore:`

Examples:

- `Add MIT license`
- `Update README with justification and clear instructions`
- `Align package.json with pi-kagi-search (keywords, peerDependencies, metadata)`

Keep commits focused (one logical change per commit).

## Release notes

- Package name: `pi-git-research`
- For npm releases, bump version (`npm version patch|minor|major`) and publish (`npm publish --access public`).
