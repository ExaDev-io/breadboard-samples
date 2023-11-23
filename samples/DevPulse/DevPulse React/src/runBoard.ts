#!/usr/bin/env npm -y tsx watch
import { MarkdownContentType } from "@exadev/breadboard-kits/types/markdown.js";
import makeMarkdown from "@exadev/breadboard-kits/util/files/makeMarkdown.js";
import dotenv from "dotenv";
import fs from "fs";
import { ignoredOutputs } from "util/IgnoredOutputs.ts";
import { cleanString } from "util/CleanString.ts";
import board from "./hackerNewsBoard.ts";

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
			run.inputs = { CLAUDE_API_KEY };
		} else if (run.node.id === "searchQuery") {
			run.inputs = {query: "OpenAI"};
		} else if (run.node.id === "searchQueries") {
			run.inputs = {
				queries: [
					"Google Chrome"
				]
			};
		} else {
			console.log("input required for", run.node.id);
		}
	} else if (run.type === "output") {
		if (ignoredOutputs.includes(run.node.id)) {
			continue;
		}
		const outputMessage = cleanString(run);
		console.log(outputMessage);
		if (run.node.id === "searchHits") {
			fs.writeFileSync("searchHits.json", JSON.stringify(run.outputs, null, 2));
		}
	}
}

