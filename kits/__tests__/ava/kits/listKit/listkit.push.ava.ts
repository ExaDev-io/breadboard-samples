import { Board } from "@google-labs/breadboard";
import test from "ava";
import ListKit from "../../../../src/kits/ListKit.js";

test("listkit.push", async (t) => {
	const board = new Board({
		title: "Exadev",
		description: "Exadev Breadboard Kit",
		version: "0.0.1",
	});
	const listKit = board.addKit(ListKit);

	const item = board.input({
		$id: "input",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "item",
					description: "item",
				},
			},
		},
	});

	const list = board.input({
		$id: "list",
		schema: {
			type: "object",
			properties: {
				list: {
					type: "array",
					title: "list",
					description: "list",
				},
			},
		},
	});

	const push = listKit.push();
	item.wire("->item", push);
	list.wire("->list", push);

	const output = board.output();
	push.wire("list->", output);

	const result = await board.runOnce({
		list: ["a", "b", "c"],
		item: "d",
	});

	t.is((<string[]>result["list"]).length, 4);
});
