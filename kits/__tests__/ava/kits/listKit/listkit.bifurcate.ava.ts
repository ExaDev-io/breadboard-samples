import { Board } from "@google-labs/breadboard";
import test from "ava";
import ListKit from "../../../../src/kits/ListKit.js";

test("listkit.bifurcate", async (t) => {
	const board = new Board({
		title: "Exadev",
		description: "Exadev Breadboard Kit",
		version: "0.0.1",
	});
	const listKit = board.addKit(ListKit);

	const index = board.input({
		$id: "input",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "number",
					title: "index",
					description: "index",
				},
			},
		},
	});

	const list = board.input({
		$id: "input",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "array",
					title: "list",
					description: "list",
				},
			},
		},
	});

	const bifurcate = listKit.bifurcate();
	list.wire("->list", bifurcate);
	index.wire("->index", bifurcate);

	const output = board.output();
	bifurcate.wire("before->", output);
	bifurcate.wire("after->", output);

	const outputList: Array<string> = ["a", "b"];
	const outputList2: Array<string> = ["c", "d"];

	const result = await board.runOnce({
		list: ["a", "b", "c", "d"],
		index: 2,
	});

	t.deepEqual(result["before"], outputList);
	t.deepEqual(result["after"], outputList2);
});
