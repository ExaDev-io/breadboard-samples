import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/src/util/files/generateAndWriteCombinedMarkdown.js";
import { Board, Schema } from "@google-labs/breadboard";
import fs from "fs";
import path from "path";
import * as url from "url";

const board = new Board({
	title: path.basename(new URL(import.meta.url).pathname),
});

const inputOneSchema = {
	type: "object",
	properties: {
		message: {
			type: "string"
		}
	},
  } satisfies Schema;

const input = board.input({
	$id: "inputOne", schema: inputOneSchema
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

generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
	dir: url.fileURLToPath(new URL(".", import.meta.url)),
});

fs.writeFileSync(
	url.fileURLToPath(new URL("board.json", import.meta.url)),
	JSON.stringify(board, null, "\t")
);
