#!/usr/bin/env npx -y tsx watch
import exadev from "@exadev/breadboard-kits";
import { hackerNewsBoard } from "./hackerNewsBoard.js";
import { MarkdownContentType } from '@exadev/breadboard-kits/dist/types/markdown.js';

////////////////////////////////////////////////

exadev.util.files.makeMarkdown({
	board: hackerNewsBoard,
	filename: "README",
	title: "Hacker News",
	dir: ".",
	markdownConfig: [
		MarkdownContentType.mermaid,
		MarkdownContentType.json
	]
});

const suppressedOutputIds = [
	"commentOutput",
	"fullCommentData"
];

for await (const run of hackerNewsBoard.run({
	// probe: new LogProbe(),
})) {
	if (run.type == "output") {
		if (suppressedOutputIds.includes(run.node.id)) {
			continue;
		}
		console.log(run.node.id, run.outputs);
	}
}
