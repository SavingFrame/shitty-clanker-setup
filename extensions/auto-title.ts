import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';

function terminalTitle(ctx: ExtensionContext): string {
  const name = ctx.sessionManager
    .getSessionName()
    ?.replace(/[\p{Cc}\p{Cf}|]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return `pi|${name || 'untitled'}`;
}

/** Display the native session name for pi-send's tmux pane picker. No model calls. */
export default function autoTitle(pi: ExtensionAPI): void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  function update(ctx: ExtensionContext): void {
    clearTimeout(timer);
    timer = undefined;
    if (ctx.mode !== 'tui') {
      return;
    }
    // Pi also sets its title during session binding. Apply our routing prefix afterward.
    timer = setTimeout(() => {
      timer = undefined;
      ctx.ui.setTitle(terminalTitle(ctx));
    }, 50);
  }

  pi.on('session_start', (_event, ctx) => update(ctx));
  pi.on('session_info_changed', (_event, ctx) => update(ctx));
  pi.on('session_shutdown', () => {
    clearTimeout(timer);
    timer = undefined;
  });

  pi.registerCommand('auto-title', {
    description: 'Show the terminal routing title from the native session name',
    handler: async (_args, ctx) => {
      ctx.ui.notify(`Terminal title: ${terminalTitle(ctx)}`, 'info');
    },
  });
}
