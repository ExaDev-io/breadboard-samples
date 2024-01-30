import { Board } from "@google-labs/breadboard";
import test from "ava";
import ListKit from "../../../../src/kits/ListKit.js";

test("listkit.splice", async (t) => {
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

	const splice = listKit.splice();
	list.wire("->list", splice);
	index.wire("->start", splice);
	index.wire("->count", splice);
	list.wire("->items", splice);

	const output = board.output();
	splice.wire("extracted->", output);
	splice.wire("list->", output);

	const deleted: Array<string> = ["b", "c"];
	const originalList: Array<string> = ["a", "b", "c", "d"];
	// originalList gets modified by the first call, so make a copy of the original
	const originalList2 = originalList.slice();
	const newList: Array<string> = ["a", "e", "f", "d"];
	const newList2: Array<string> = ["a", "d"];

	// remove and add new elements
	const result = await board.runOnce({
		list: originalList,
		start: 1,
		count: 2,
		items: ["e", "f"],
	});

	// remove but don't add new elements
	const result2 = await board.runOnce({
		list: originalList2,
		start: 1,
		count: 2,
		items: [],
	});

	t.deepEqual(result["extracted"], deleted);
	t.deepEqual(result["list"], newList);
	t.deepEqual(result2["list"], newList2);
});
