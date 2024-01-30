#!/usr/bin/env npx -y tsx

import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/src/util/files/generateAndWriteCombinedMarkdown.js";
import { Board, Schema } from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";
import fs from "fs";
import * as url from "url";

/*
	Slot has now been deprecated.
*/
const board: Board = new Board({
	title: "Adding Slot to a Board",
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

const input = board.input({ $id: "mainInputNode", schema: inputSchema });
const output = board.output({ $id: "mainOutputNode" });

input
	.wire(
		"mainInput->nestedInput",
		core
			.slot({ slot: "nested" })
			.wire("nestedOutput", output)
	);

const nested = new Board({
	title: "Nested Board to be Slotted",
});

nested
	.input({
		$id: "nestedInputNode",
	})
	.wire(
		"nestedInput->nestedOutput",
		nested.output({ $id: "nestedOutputNode" })
	);

(async () => {
	for await (const runResult of board.run({
		slots: {
			nested,
		},
	})) {
		if (runResult.type === "input") {
			runResult.inputs = {
				mainInput: "Hello World!",
			};
		} else if (runResult.type === "output") {
			console.log(runResult.node.id, runResult.outputs);
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
