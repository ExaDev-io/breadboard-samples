#!/usr/bin/env npx -y tsx

import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/src/util/files/generateAndWriteCombinedMarkdown.js";
import { Board, Schema } from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";
import fs from "fs";
import * as url from "url";

const board = new Board({
	title: "Include Board as a Node with URL",
});

const core = board.addKit(Core);

const inputSchema = {
	type: "object",
	properties: {
		mainInput: {
			type: "string"
		}
	},
  } satisfies Schema;

const NESTED_BOARD_URL =
	"https://raw.githubusercontent.com/ExaDev-io/breadboard-samples/develop/samples/Breadboard%20Walkthrough/src/include-board-as-a-node-with-url/nestedboard.json";

await fetch(NESTED_BOARD_URL).then((response) => {
	if (!response.ok) {
		throw new Error(
			`Received ${response.status} response for "${response.url}"`
		);
	} else {
		console.debug(`Received ok response for "${response.url}"`);
	}
});

const input = board.input({
	$id: "mainInputNode", schema: inputSchema
});

const nestedBoard = core.invoke({ path: NESTED_BOARD_URL });
const output = board.output({ $id: "mainOutputNode" });
const nestedBoardInvocation = nestedBoard.wire("nestedOutput", output);

input.wire(
	"mainInput->nestedInput",
	nestedBoardInvocation
);

(async () => {
	for await (const run of board.run()) {
		if (run.type === "input") {
			run.inputs = {
				mainInput: "Hello World!",
			};
		} else if (run.type === "output") {
			console.log(run.node.id, run.outputs);
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
