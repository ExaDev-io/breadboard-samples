#!/usr/bin/env npm -y tsx watch
import { MarkdownContentType } from "@exadev/breadboard-kits/types/markdown.js";
import makeMarkdown from "@exadev/breadboard-kits/util/files/makeMarkdown.js";

import dotenv from "dotenv";
import board from "./hackerNewsBoard.ts";
import { cleanString, ignoredOutputs } from "./TerminalOutput.tsx";

dotenv.config({
	path: ".env"
});


const CLAUDE_API_KEY = process.env.VITE_CLAUDE_API_KEY;

makeMarkdown({
	board,
	filename: "README",
	title: "Hacker News",
	dir: ".",
	markdownConfig: [
		MarkdownContentType.mermaid,
		MarkdownContentType.json
	]
});


for await (const run of board.run()) {
	if (run.type === "input") {
		if (run.node.id === "claudeApiKey") {
			run.inputs = {CLAUDE_API_KEY};
		} else {
			console.log("input required for", run.node.id);
		}
	} else if (run.type === "output") {
		if (ignoredOutputs.includes(run.node.id)) {
			continue;
		}
		const outputMessage = cleanString(run);
		console.log(outputMessage);
	}
}

