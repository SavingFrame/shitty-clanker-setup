# Pi agent setup

Personal configuration for the [Pi coding agent](https://github.com/earendil-works/pi-mono).

This repository is my local Pi config. It tracks the parts I want versioned and ignores local runtime state, tokens, caches, and session logs.

## Contents

- `settings.json`, `models.json`, and `verbosity.json` for Pi defaults
- `keybindings.json` for local TUI shortcuts
- `mcp.json`, `mcporter.json`, and `mcporter-config.json` for MCP setup
- `extensions/` for local and linked extensions
- `skills/` for local and linked skills
- `themes/` for custom themes

Some files are symlinked from [mitsuhiko/agent-stuff](https://github.com/mitsuhiko/agent-stuff). This repo is partly a curated Pi config and partly a mirror of pieces I use from that setup.

## Current defaults

From `settings.json`:

- provider: `openai-codex-personal`
- model: `gpt-5.5`
- thinking level: `medium`
- theme: `moonfly`
- thinking blocks hidden by default

## Extensions

### Local / customized

| Filename | Description | Author |
| --- | --- | --- |
| [`extensions/read-inline.ts`](./extensions/read-inline.ts) | Inline renderer and wrapper for the built-in `read` tool. | |

### Linked from `agent-stuff`

| Filename | Description | Author |
| --- | --- | --- |
| [`extensions/files.ts`](./extensions/files.ts) | `/files` picker for repo and session file navigation. | [@mitsuhiko](https://github.com/mitsuhiko) |
| [`extensions/notify.ts`](./extensions/notify.ts) | Desktop notifications when Pi is ready again. | [@mitsuhiko](https://github.com/mitsuhiko) |
| [`extensions/session-breakdown.ts`](./extensions/session-breakdown.ts) | TUI analytics for Pi session history. | [@mitsuhiko](https://github.com/mitsuhiko) |

## Themes

- `themes/moonfly.json`
- `themes/nightowl.json`
- `themes/rose-pine.json`
- `themes/rose-pine-dawn.json`

Current default theme in `settings.json`: **moonfly**.

## Skills

| Filename | Description | Author |
| --- | --- | --- |
| [`skills/ast-grep/SKILL.md`](./skills/ast-grep/SKILL.md) | Structural code search with ast-grep rules. | local |
| [`skills/gws-gmail/SKILL.md`](./skills/gws-gmail/SKILL.md) | Gmail workflows through the `gws` CLI. | local |
| [`skills/gws-shared/SKILL.md`](./skills/gws-shared/SKILL.md) | Shared `gws` CLI authentication and output patterns. | local |
| [`skills/commit`](./skills/commit) | Commit message and commit-flow guidance. | [@mitsuhiko](https://github.com/mitsuhiko) |
| [`skills/github`](./skills/github) | GitHub workflows via `gh`. | [@mitsuhiko](https://github.com/mitsuhiko) |
| [`skills/librarian`](./skills/librarian) | Cache and refresh remote git repositories for reference work. | [@mitsuhiko](https://github.com/mitsuhiko) |
| [`skills/tmux`](./skills/tmux) | tmux-driven interactive terminal control. | [@mitsuhiko](https://github.com/mitsuhiko) |
| [`skills/uv`](./skills/uv) | Python workflows using `uv`. | [@mitsuhiko](https://github.com/mitsuhiko) |

## Keybinding tweaks

From `keybindings.json`:

- `Alt+Enter` inserts a newline
- `Ctrl+Enter` sends a follow-up
- `Ctrl+P` and `Ctrl+N` move selection
- model cycling shortcuts are disabled

## Credits

Some extensions and skills are linked from [`agent-stuff`](https://github.com/mitsuhiko/agent-stuff).
