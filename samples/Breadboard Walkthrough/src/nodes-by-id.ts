import { Board } from "@google-labs/breadboard";
import exadev from "@exadev/breadboard-kits";
import path from "path";
import {makeMarkdown} from "@exadev/breadboard-kits/dist/util/files/makeMarkdown.js"
import {MarkdownContentList, MarkdownContentType} from "@exadev/breadboard-kits/dist/types/markdown.js"

const board = new Board({
	title: path.basename(new URL(import.meta.url).pathname),
});
const input = board.input({
	$id: "inputOne",
});

const output = board.output();

input.wire("message", output);

(async () => {
	let counter = 1;
	for await (const run of board.run()) {
		if (run.type === "input") {
			if (run.node.id === "inputOne") {
				run.inputs = {
					message: "This message will print",
				};
			} else if (run.node.id === "inputTwo") {
				run.inputs = {
					message: "This message will never be sent",
				};
			}
		} else if (run.type === "output") {
			console.log("=".repeat(80));
			console.log(JSON.stringify(run.outputs, null, 2));
		}
	}
})();

const markdownConfig : MarkdownContentList = [MarkdownContentType.mermaid, MarkdownContentType.json]
const filename = board.title
const title = board.title
const dir = "output"

makeMarkdown({board, filename, title, dir, markdownConfig});
