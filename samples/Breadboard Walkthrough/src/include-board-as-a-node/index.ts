#!/usr/bin/env npx -y tsx

import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { Board, GraphDescriptor, Schema } from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";
import fs from "fs";
import * as url from "url";

const nestedBoard = new Board({
	title: "Nested Board",
});

const inputSchema = {
	type: "object",
	properties: {
		mainInput: {
			type: "string"
		}
	},
  } satisfies Schema;

const input = nestedBoard.input({ $id: "nestedInputNode", schema: inputSchema })

input
	.wire(
		"nestedInput->nestedOutput",
		nestedBoard.output({ $id: "nestedOutputNode" })
	);

const board = new Board({
	title: "Include Board as a Node",
});

const core = board.addKit(Core);

board
	.input({
		$id: "mainInputNode",
	})
	.wire(
		"mainInput->nestedInput",
		core
			.invoke({ graph: nestedBoard as GraphDescriptor })
			.wire("nestedOutput", board.output({ $id: "mainOutputNode" }))
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
