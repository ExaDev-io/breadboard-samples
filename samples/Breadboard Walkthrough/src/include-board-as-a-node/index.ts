#!/usr/bin/env npx -y tsx

import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/src/util/files/generateAndWriteCombinedMarkdown.js";
import { Board, GraphDescriptor, Schema } from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";
import fs from "fs";
import * as url from "url";

const nestedBoard = new Board({
	title: "Nested Board",
});

const nestedInputSchema = {
	type: "object",
	properties: {
		nestedInput: {
			type: "string"
		}
	},
  } satisfies Schema;

const mainInputSchema = {
	type: "object",
	properties: {
		mainInput: {
			type: "string"
		}
	},
  } satisfies Schema;

const nestedInput = nestedBoard.input({ $id: "nestedInputNode", schema: nestedInputSchema })


nestedInput
	.wire(
		"nestedInput->nestedOutput",
		nestedBoard.output({ $id: "nestedOutputNode" })
	);

const board = new Board({
	title: "Include Board as a Node",
});

const core = board.addKit(Core);

const mainInput = board.input({ $id: "mainInputNode", schema: mainInputSchema })

mainInput
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
