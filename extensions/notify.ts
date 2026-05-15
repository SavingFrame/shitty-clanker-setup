/**
 * Desktop Notification Extension
 *
 * Sends a native desktop notification when the agent finishes and is waiting for input.
 *
 * Protocols:
 * - OSC 777: Ghostty, iTerm2, WezTerm, rxvt-unicode
 * - OSC 99: Kitty
 * - Windows toast: Windows Terminal (WSL)
 *
 * tmux support:
 * - OSC sequences are wrapped in tmux passthrough (DCS) when TMUX is set.
 * - Requires `set -g allow-passthrough on` in tmux.conf.
 */

import { execFile, execFileSync } from "node:child_process";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Markdown, type MarkdownTheme } from "@mariozechner/pi-tui";

const sanitizeOscField = (value: string): string =>
	value
		// Remove OSC/delimiter control chars that can break the sequence
		.replace(/[\x00-\x1f\x7f]/g, " ")
		.replace(/[;\u001b\u0007]/g, " ")
		.replace(/\s+/g, " ")
		.trim();

const wrapTmuxPassthrough = (sequence: string): string => {
	// tmux passthrough format: ESC P tmux; <payload with doubled ESC> ESC \
	// See tmux allow-passthrough docs.
	const escapedPayload = sequence.replace(/\u001b/g, "\u001b\u001b");
	return `\u001bPtmux;${escapedPayload}\u001b\\`;
};

const writeTerminalSequence = (sequence: string): void => {
	if (process.env.TMUX) {
		process.stdout.write(wrapTmuxPassthrough(sequence));
		return;
	}
	process.stdout.write(sequence);
};

function notifyOSC777(title: string, body: string): void {
	const safeTitle = sanitizeOscField(title);
	const safeBody = sanitizeOscField(body);
	writeTerminalSequence(`\u001b]777;notify;${safeTitle};${safeBody}\u0007`);
}

function notifyOSC99(title: string, body: string): void {
	const safeTitle = sanitizeOscField(title);
	const safeBody = sanitizeOscField(body);
	// Kitty OSC 99: first title, then body via p=body
	writeTerminalSequence(`\u001b]99;i=1:d=0;${safeTitle}\u001b\\`);
	writeTerminalSequence(`\u001b]99;i=1:p=body;${safeBody}\u001b\\`);
}

function windowsToastScript(title: string, body: string): string {
	const escapedTitle = title.replace(/'/g, "''");
	const escapedBody = body.replace(/'/g, "''");
	const type = "Windows.UI.Notifications";
	const mgr = `[${type}.ToastNotificationManager, ${type}, ContentType = WindowsRuntime]`;
	const template = `[${type}.ToastTemplateType]::ToastText02`;
	return [
		`${mgr} > $null`,
		`$xml = [${type}.ToastNotificationManager]::GetTemplateContent(${template})`,
		`$xml.GetElementsByTagName('text')[0].AppendChild($xml.CreateTextNode('${escapedTitle}')) > $null`,
		`$xml.GetElementsByTagName('text')[1].AppendChild($xml.CreateTextNode('${escapedBody}')) > $null`,
		`$toast = [${type}.ToastNotification]::new($xml)`,
		`[${type}.ToastNotificationManager]::CreateToastNotifier('pi').Show($toast)`,
	].join("; ");
}

function notifyWindows(title: string, body: string): void {
	execFile("powershell.exe", ["-NoProfile", "-Command", windowsToastScript(title, body)], () => {
		// Ignore errors silently; notification is best-effort.
	});
}

function notify(title: string, body: string): void {
	if (process.env.WT_SESSION) {
		notifyWindows(title, body);
	} else if (process.env.KITTY_WINDOW_ID) {
		notifyOSC99(title, body);
	} else {
		notifyOSC777(title, body);
	}
}

function getTmuxSessionName(): string | null {
	if (!process.env.TMUX) {
		return null;
	}

	try {
		const sessionName = execFileSync("tmux", ["display-message", "-p", "#S"], {
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
		return sessionName || null;
	} catch {
		return null;
	}
}

const withTmuxSessionInTitle = (title: string): string => {
	if (!process.env.TMUX) {
		return title;
	}
	const sessionName = getTmuxSessionName();
	return sessionName ? `${title} [${sessionName}]` : `${title} [tmux]`;
};

const isTextPart = (part: unknown): part is { type: "text"; text: string } =>
	Boolean(part && typeof part === "object" && "type" in part && part.type === "text" && "text" in part);

const extractLastAssistantText = (messages: Array<{ role?: string; content?: unknown }>): string | null => {
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages[i];
		if (message?.role !== "assistant") {
			continue;
		}

		const content = message.content;
		if (typeof content === "string") {
			return content.trim() || null;
		}

		if (Array.isArray(content)) {
			const text = content
				.filter(isTextPart)
				.map((part) => part.text)
				.join("\n")
				.trim();
			return text || null;
		}

		return null;
	}

	return null;
};

const plainMarkdownTheme: MarkdownTheme = {
	heading: (text) => text,
	link: (text) => text,
	linkUrl: () => "",
	code: (text) => text,
	codeBlock: (text) => text,
	codeBlockBorder: () => "",
	quote: (text) => text,
	quoteBorder: () => "",
	hr: () => "",
	listBullet: () => "",
	bold: (text) => text,
	italic: (text) => text,
	strikethrough: (text) => text,
	underline: (text) => text,
};

const simpleMarkdown = (text: string, width = 80): string => {
	const markdown = new Markdown(text, 0, 0, plainMarkdownTheme);
	return markdown.render(width).join("\n");
};

const formatNotification = (text: string | null): { title: string; body: string } => {
	const simplified = text ? simpleMarkdown(text) : "";
	const normalized = simplified.replace(/\s+/g, " ").trim();
	if (!normalized) {
		return { title: "Ready for input", body: "" };
	}

	const maxBody = 200;
	const body = normalized.length > maxBody ? `${normalized.slice(0, maxBody - 1)}…` : normalized;
	return { title: "π", body };
};

export default function (pi: ExtensionAPI) {
	pi.on("agent_end", async (event) => {
		const lastText = extractLastAssistantText(event.messages ?? []);
		const { title, body } = formatNotification(lastText);
		notify(withTmuxSessionInTitle(title), body);
	});
}
