/**
 * Built-in Tool Renderer Example - "thinking"-style compact rendering
 *
 * Usage:
 *   pi -e ./built-in-tool-renderer.ts
 */

import type { BashToolDetails, EditToolDetails, ExtensionAPI, ReadToolDetails } from "@mariozechner/pi-coding-agent";
import { createBashTool, createEditTool, createReadTool } from "@mariozechner/pi-coding-agent";
import { Text } from "@mariozechner/pi-tui";

function trimOneLine(text: string, max = 90): string {
	const oneLine = text.replace(/\s+/g, " ").trim();
	return oneLine.length > max ? `${oneLine.slice(0, max - 1)}…` : oneLine;
}

function countDiffStats(diff: string): { adds: number; dels: number } {
	let adds = 0;
	let dels = 0;
	for (const line of diff.split("\n")) {
		if (line.startsWith("+++ ") || line.startsWith("--- ")) continue;
		if (line.startsWith("+")) adds++;
		if (line.startsWith("-")) dels++;
	}
	return { adds, dels };
}

export default function (pi: ExtensionAPI) {
	const cwd = process.cwd();

	const originalRead = createReadTool(cwd);

	// --- Read tool ---
	pi.registerTool({
		name: "read",
		label: "read",
		description: originalRead.description,
		parameters: originalRead.parameters,

		async execute(toolCallId, params, signal, onUpdate) {
			return originalRead.execute(toolCallId, params, signal, onUpdate);
		},

		renderCall(args, theme) {
			let text = theme.fg("thinkingText", "⋯ ");
			text += theme.fg("dim", "reading ");
			text += theme.fg("accent", args.path);
			return new Text(text, 0, 0);
		},

		renderResult(result, { expanded, isPartial }, theme) {
			if (isPartial) return new Text(theme.fg("thinkingText", "◌ reading…"), 0, 0);

			const details = result.details as ReadToolDetails | undefined;
			const content = result.content[0];

			if (content?.type === "image") return new Text(theme.fg("success", "✓ image loaded"), 0, 0);
			if (content?.type !== "text") return new Text(theme.fg("warning", "◌ no readable text"), 0, 0);

			const lineCount = content.text.split("\n").length;
			let text = theme.fg("success", `✓ read ${lineCount} lines`);
			if (details?.truncation?.truncated) {
				text += theme.fg("warning", `  ⚠ truncated from ${details.truncation.totalLines}`);
			}

			if (expanded) {
				const lines = content.text.split("\n").slice(0, 12);
				for (const line of lines) text += `\n${theme.fg("dim", line)}`;
				if (lineCount > 12) text += `\n${theme.fg("muted", `… ${lineCount - 12} more lines`)}`;
			}

			return new Text(text, 0, 0);
		},
	});


}
