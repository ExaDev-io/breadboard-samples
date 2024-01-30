import generateAndWriteCombinedMarkdown
	from "@exadev/breadboard-kits/src/util/files/generateAndWriteCombinedMarkdown.js";
import { Board, Schema } from "@google-labs/breadboard";
import fs from "fs";
import * as url from "url";

const board = new Board({
	title: "Hello World",
});

const inputSchema = {
	type: "object",
	properties: {
		message: {
			type: "string"
		}
	},
  } satisfies Schema;

const input = board.input({ schema: inputSchema });

(async () => {
	input.wire("*", board.output());
	console.log(
		await board.runOnce({
			message: "Hello Breadboard!",
		})
	);
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
