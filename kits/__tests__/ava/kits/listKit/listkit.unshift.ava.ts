import { Board } from "@google-labs/breadboard";
import test from "ava";
import ListKit from "../../../../src/kits/ListKit.js";

test("listkit.unshift", async (t) => {
	const board = new Board({
		title: "Exadev",
		description: "Exadev Breadboard Kit",
		version: "0.0.1",
	});
	const listKit = board.addKit(ListKit);

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

	const input = board.input({
		$id: "input",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "text",
					title: "text",
					description: "text",
				},
			},
		},
	});

	const unshift = listKit.unshift();
	list.wire("->list", unshift);
	input.wire("->item", unshift);

	const output = board.output();
	unshift.wire("->list", output);

	const outputList: Array<string> = ["a", "b", "c"];

	const result = await board.runOnce({
		list: ["b", "c"],
		item: "a",
	});

	t.deepEqual(result["list"], outputList);
});
