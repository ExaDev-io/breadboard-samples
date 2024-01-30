import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { Board, Schema } from "@google-labs/breadboard";
import fs from "fs";
import * as url from "url";

const board = new Board({
	title: "Multiple Inputs",
});

const inputSchema = {
	type: "object",
	properties: {
		message: {
			type: "string"
		}
	},
  } satisfies Schema;

const output = board.output();

const inputOne = board.input({ $id: "inputOne", schema: inputSchema });
inputOne.wire("message", output);

const inputTwo = board.input({ $id: "inputTwo", schema: inputSchema });
inputTwo.wire("message", output);

let counter = 1;

(async () => {
	for await (const run of board.run()) {
		if (run.type === "input") {
			run.inputs = {
				message: `Hello Input ${counter++}!`,
			};
		} else if (run.type === "output") {
			console.log(run.outputs);
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
