import { execFile } from "node:child_process";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

type State = "idle" | "working" | "blocked" | "done" | "error";

/** Publish interactive Pi status to this pane without changing its title. */
export default function (pi: ExtensionAPI) {
	const pane = process.env.TMUX_PANE;
	if (!process.env.TMUX || !pane || !/^%\d+$/.test(pane)) return;

	let enabled = false;
	let active = false;
	let prompts = 0;
	let failed = false;
	let resting: State = "idle";
	let last: State | undefined;

	const tmux = (args: string[]) => new Promise<boolean>((resolve) => {
		execFile("tmux", args, { timeout: 1500 }, (error) => resolve(!error));
	});
	const report = async () => {
		if (!enabled) return;
		const state: State = prompts > 0 ? "blocked" : active ? "working" : resting;
		if (state === last) return;
		if (await tmux(["set-option", "-p", "-t", pane, "@pi_status", state])) last = state;
	};

	pi.on("session_start", async (_event, ctx) => {
		enabled = ctx.mode === "tui";
		active = false;
		prompts = 0;
		failed = false;
		resting = "idle";
		last = undefined;
		await report();
	});
	pi.on("before_agent_start", async () => {
		active = true;
		await report();
	});
	pi.on("agent_start", async () => {
		active = true;
		failed = false;
		await report();
	});
	pi.on("message_end", (event) => {
		// A successful retry replaces the earlier error.
		if (event.message.role === "assistant") failed = event.message.stopReason === "error";
	});
	pi.on("agent_settled", async (event) => {
		active = false;
		resting = event.aborted ? "idle" : failed ? "error" : "done";
		await report();
	});
	pi.on("ui_prompt_start", async () => {
		prompts++;
		await report();
	});
	pi.on("ui_prompt_end", async () => {
		prompts = Math.max(0, prompts - 1);
		await report();
	});
	pi.on("session_shutdown", async () => {
		if (!enabled) return;
		enabled = false;
		await tmux(["set-option", "-pu", "-t", pane, "@pi_status"]);
		last = undefined;
	});
}
