# Pi agent setup

Personal configuration for the [Pi coding agent](https://github.com/badlogic/pi-mono).

This repo collects my local Pi setup:

- custom settings and keybindings
- MCP config
- custom themes
- local skills
- custom extensions

A few files here are symlinked from [mitsuhiko/agent-stuff](https://github.com/mitsuhiko/agent-stuff), so this repo is partly a curated Pi config and partly a mirror of pieces I use from that setup.

## Layout

```text
settings.json                # main Pi config
keybindings.json             # TUI key overrides
mcp.json                     # MCP server config
themes/                      # custom themes
extensions/                  # local + linked extensions
skills/                      # local + linked skills
verbosity.json               # verbosity control config
pi-codex-web-search.settings.json
```

## Extensions

### Local / customized

| Filename | Description | Author |
| --- | --- | --- |
| [`extensions/edit.ts`](./extensions/edit.ts) | Customized edit tool with fuzzy matching and nicer diff handling. | |
| [`extensions/built-in-tool-renderer.ts`](./extensions/built-in-tool-renderer.ts) | Compact “thinking”-style renderer for built-in tools. | |
| [`extensions/guardrails.json`](./extensions/guardrails.json) | Guardrails config for safer shell and file operations. | [@aliou](https://github.com/aliou) |
| [`extensions/pi-rtk-optimizer/config.json`](./extensions/pi-rtk-optimizer/config.json) | RTK output compaction and rewrite settings. | |

### Linked from `agent-stuff`

| Filename | Description | Author |
| --- | --- | --- |
| [`extensions/files.ts`](./extensions/files.ts) | `/files` picker for repo and session file navigation. | [@mitsuhiko](https://github.com/mitsuhiko) |
| [`extensions/notify.ts`](./extensions/notify.ts) | Desktop notifications when Pi is ready again. | [@mitsuhiko](https://github.com/mitsuhiko) |
| [`extensions/review.ts`](./extensions/review.ts) | Interactive `/review` workflow for PRs, branches, commits, and uncommitted changes. | [@mitsuhiko](https://github.com/mitsuhiko) |
| [`extensions/session-breakdown.ts`](./extensions/session-breakdown.ts) | TUI analytics for Pi session history. | [@mitsuhiko](https://github.com/mitsuhiko) |

### Linked from Pi examples

| Filename | Description | Author |
| --- | --- | --- |
| [`extensions/plan-mode`](./extensions/plan-mode) | Symlink to the upstream Pi `plan-mode` example. | [@badlogic](https://github.com/badlogic) |

## Themes

- `themes/rose-pine.json`
- `themes/rose-pine-dawn.json`
- `themes/nightowl.json`

Current default theme in `settings.json`: **rose-pine**.

## Skills

| Filename | Description | Author |
| --- | --- | --- |
| [`skills/ast-grep/SKILL.md`](./skills/ast-grep/SKILL.md) | Structural code search with ast-grep rules. | doc |
| [`skills/commit`](./skills/commit) | Commit message and commit-flow guidance. | [@mitsuhiko](https://github.com/mitsuhiko) |
| [`skills/github`](./skills/github) | GitHub workflows via `gh`. | [@mitsuhiko](https://github.com/mitsuhiko) |
| [`skills/tmux`](./skills/tmux) | tmux-driven interactive terminal control. | [@mitsuhiko](https://github.com/mitsuhiko) |
| [`skills/uv`](./skills/uv) | Python workflows using `uv`. | [@mitsuhiko](https://github.com/mitsuhiko) |

## Keybinding tweaks

From `keybindings.json`:

- `Alt+Enter` inserts a newline
- `Ctrl+Enter` sends a follow-up
- `Ctrl+P` / `Ctrl+N` move selection

## Credits

Some extensions and skills are linked from [`agent-stuff`](https://github.com/mitsuhiko/agent-stuff).
