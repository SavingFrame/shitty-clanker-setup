# Pi agent setup

Personal configuration for the [Pi coding agent](https://github.com/earendil-works/pi-mono).

This repository is my local Pi config. It tracks the parts I want versioned and ignores local runtime state, tokens, caches, and session logs.

## Contents

- `AGENTS.md` for agent behavior and writing guidelines
- `settings.json` for Pi defaults and package sources
- `models.json` and `verbosity.json` for model configuration
- `keybindings.json` for local TUI shortcuts
- `extensions/` for local and linked extensions
- `skills/` for local and linked skills
- `themes/` for custom themes

Some files are symlinked from [mitsuhiko/agent-stuff](https://github.com/mitsuhiko/agent-stuff) and local projects. These links depend on checkouts outside this repository, so a clone alone does not provide every extension or skill.

## Current defaults

From `settings.json`:

- provider: `openai-codex`
- model: `gpt-6.1-sol`
- thinking level: `medium`
- theme: `noctalia`
- thinking blocks visible by default
- `codemode` enabled in addition to the default tools
- fullscreen TUI with an automatic scrollbar
- streaming Mermaid rendering

## Packages

Configured in `settings.json`:

- `npm:pi-extmgr`
- `npm:pi-btw`
- `npm:pi-docparser`
- `git:github.com/earendil-works/pi-review`
- `git:https://github.com/SavingFrame/pi-diff-review`
- `npm:@juicesharp/rpiv-ask-user-question`
- `npm:@benvargas/pi-claude-code-use` (its `extensions/index.ts` entry point is excluded)
- `git:github.com/edxeth/pi-gpt-config`
- `npm:@carlosgtrz/pi-codex-aliases`
- `npm:pi-web-access`

Package-provided skills include `btw` and `parse-document`, separate from the local `skills/` directory.

## Extensions

| Filename | Description | Source |
| --- | --- | --- |
| [`extensions/auto-title.ts`](./extensions/auto-title.ts) | Generates and persists a short terminal title from the first user message. | [pi-send.nvim](https://github.com/SavingFrame/pi-send.nvim/blob/main/extensions/auto-title.ts) |
| [`extensions/handoff.ts`](./extensions/handoff.ts) | `/handoff <goal>` prepares an editable context-transfer prompt in a new session. | local copy |
| [`extensions/notify.ts`](./extensions/notify.ts) | Desktop notifications with the last reply and tmux session name. | adapted from [@mitsuhiko](https://github.com/mitsuhiko) |
| [`extensions/tmux-status.ts`](./extensions/tmux-status.ts) | Publishes agent state to the tmux pane's `@pi_status` option. | local |
| [`extensions/files.ts`](./extensions/files.ts) | `/files` picker for repo and session file navigation. | [@mitsuhiko](https://github.com/mitsuhiko) |
| [`extensions/session-breakdown.ts`](./extensions/session-breakdown.ts) | TUI analytics for Pi session history. | [@mitsuhiko](https://github.com/mitsuhiko) |
| [`extensions/desk-gremlin-status.ts`](./extensions/desk-gremlin-status.ts) | Publishes session status and heartbeats for the ESP32 desk gremlin project. | [desk-gremlin](https://github.com/SavingFrame/desk-gremlin) |
| [`extensions/noctalia-ai-monitor`](./extensions/noctalia-ai-monitor) | Publishes session metadata, tool activity, and context usage to Noctalia AI Monitor. | [noctalia-ai-monitor](https://github.com/SavingFrame/noctalia-ai-monitor) |

Terminal notifications inside tmux require `set -g allow-passthrough on`.

### Disabled renderers

These files are retained but are not active extension entry points:

- `extensions/read-inline.ts.disabled`
- `extensions/built-in-tool-renderer.ts.disabled`

## Themes

- `themes/noctalia.json`
- `themes/moonfly.json`
- `themes/nightowl.json`
- `themes/rose-pine.json`
- `themes/rose-pine-dawn.json`

Current default theme in `settings.json`: **noctalia**.

## Skills

| Filename | Description | Author |
| --- | --- | --- |
| [`skills/ast-grep/SKILL.md`](./skills/ast-grep/SKILL.md) | Structural code search with ast-grep rules. | local |
| [`skills/gws-gmail/SKILL.md`](./skills/gws-gmail/SKILL.md) | Gmail workflows through the `gws` CLI. | local |
| [`skills/gws-shared/SKILL.md`](./skills/gws-shared/SKILL.md) | Shared `gws` CLI authentication and output patterns. | local |
| [`skills/openscad/SKILL.md`](./skills/openscad/SKILL.md) | OpenSCAD modeling, multi-angle previews, validation, and STL export. | local |
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
