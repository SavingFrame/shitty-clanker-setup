import type { ExtensionAPI, ReadToolDetails } from "@earendil-works/pi-coding-agent";
import { createReadTool } from "@earendil-works/pi-coding-agent";
import { Container, Text } from "@earendil-works/pi-tui";
import { homedir } from "node:os";

type ReadInlineState = {
	status?: string;
};

function shortenPath(path: string): string {
	const home = homedir();
	return path.startsWith(home) ? `~${path.slice(home.length)}` : path;
}

function getSummary(result: {
	content: Array<{ type: string; text?: string }>;
	details?: ReadToolDetails;
}): string {
	const content = result.content[0];
	if (!content) return "done";
	if (content.type === "image") return "image";
	if (content.type !== "text") return "done";

	const lineCount = content.text ? content.text.split("\n").length : 0;
	let summary = `${lineCount} lines`;
	if (result.details?.truncation?.truncated) {
		summary += `, truncated`;
	}
	return summary;
}

function getStatusIcon(status: string, theme: { fg: (token: string, text: string) => string }): string {
	if (status === "… reading") return theme.fg("warning", "󰔛");
	if (status === "error") return theme.fg("error", "󰅚");
	return theme.fg("success", "󰄬");
}

function getStatusText(status: string, theme: { fg: (token: string, text: string) => string }): string {
	if (status === "error") return theme.fg("error", status);
	return theme.fg("muted", status);
}

export default function (pi: ExtensionAPI) {
	const originalRead = createReadTool(process.cwd());

	pi.registerTool({
		name: "read",
		label: "read",
		description: originalRead.description,
		parameters: originalRead.parameters,
		renderShell: "self",

		async execute(toolCallId, params, signal, onUpdate, ctx) {
			const tool = createReadTool(ctx.cwd);
			return tool.execute(toolCallId, params, signal, onUpdate);
		},

		renderCall(args, theme, context) {
			const text = (context.lastComponent as Text | undefined) ?? new Text("", 0, 0);
			const path = shortenPath(args.path || "...");
			const parts: string[] = [];
			if (args.offset !== undefined) parts.push(`offset=${args.offset}`);
			if (args.limit !== undefined) parts.push(`limit=${args.limit}`);
			const range = parts.length ? theme.fg("dim", ` (${parts.join(", ")})`) : "";
			const rawStatus = (context.state as ReadInlineState).status;
			const status = rawStatus
				? `${theme.fg("dim", " · ")}${getStatusIcon(rawStatus, theme)} ${getStatusText(rawStatus, theme)}`
				: "";
			text.setText(`${theme.fg("accent", "󰱼")} ${theme.fg("toolTitle", theme.bold("read"))} ${theme.fg("accent", path)}${range}${status}`);
			return text;
		},

		renderResult(result, { expanded, isPartial, isError }, theme, context) {
			const state = context.state as ReadInlineState;
			const nextStatus = isPartial
				? "… reading"
				: isError
					? "error"
					: getSummary(result as { content: Array<{ type: string; text?: string }>; details?: ReadToolDetails });

			if (state.status !== nextStatus) {
				state.status = nextStatus;
				context.invalidate();
			}

			if (!expanded || isPartial) {
				return new Container();
			}

			const content = result.content[0];
			if (content?.type !== "text" || !content.text) {
				return new Container();
			}

			return new Text(`\n${theme.fg("toolOutput", content.text)}`, 0, 0);
		},
	});
}
