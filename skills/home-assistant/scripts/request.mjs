import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const configPath = join(homedir(), ".config/home-assistant/api.json");

async function main() {
	const [method = "GET", path = "/api/", data, ...extra] =
		process.argv.slice(2);
	if (extra.length || !["GET", "POST", "DELETE"].includes(method)) {
		throw new Error("Usage: node request.mjs GET|POST|DELETE /api/path [JSON]");
	}
	if (!path.startsWith("/api/") || path.includes("#")) {
		throw new Error("Use a relative /api/ path without a fragment.");
	}
	if (method !== "POST" && data !== undefined) {
		throw new Error("Only POST accepts a JSON body.");
	}
	if (data !== undefined) JSON.parse(data);

	let config;
	try {
		config = JSON.parse(await readFile(configPath, "utf8"));
	} catch {
		throw new Error(`Create valid JSON credentials at ${configPath}.`);
	}
	if (
		typeof config?.url !== "string" ||
		typeof config?.token !== "string" ||
		!config.token.trim() ||
		config.token === "REPLACE_WITH_LONG_LIVED_ACCESS_TOKEN"
	) {
		throw new Error(`Set url and token in ${configPath}.`);
	}
	const base = new URL(config.url);
	if (
		!["http:", "https:"].includes(base.protocol) ||
		base.username ||
		base.password ||
		base.search ||
		base.hash ||
		!["", "/"].includes(base.pathname)
	) {
		throw new Error(
			"url must be an HTTP(S) server origin, without /api/ or credentials.",
		);
	}
	const target = new URL(path, base);
	if (target.origin !== base.origin || !target.pathname.startsWith("/api/")) {
		throw new Error("Request must stay inside the configured server /api/.");
	}

	let response;
	let body;
	try {
		response = await fetch(target, {
			method,
			headers: {
				Authorization: `Bearer ${config.token}`,
				"Content-Type": "application/json",
			},
			body: data,
			redirect: "error",
			signal: AbortSignal.timeout(30000),
		});
		body = await response.text();
	} catch {
		throw new Error(
			"Request failed or timed out. Check connectivity and TLS. A write may have completed; do not automatically retry.",
		);
	}
	if (!response.ok) {
		throw new Error(
			`Home Assistant returned HTTP ${response.status}. No automatic retry performed.`,
		);
	}
	// Redact the exact credential if an endpoint unexpectedly echoes it.
	const safe = body.replaceAll(config.token, "[REDACTED]");
	try {
		console.log(JSON.stringify(JSON.parse(safe), null, 2));
	} catch {
		console.log(safe);
	}
}

main().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
