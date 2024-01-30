import { Board } from "@google-labs/breadboard";
import test from "ava";
import ListKit from "../../../../src/kits/ListKit.js";

test("listkit.shift", async (t) => {
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

	const shift = listKit.shift();
	list.wire("->list", shift);

	const output = board.output();
	shift.wire("list->", output);
	shift.wire("item->", output);

	const outputList: Array<string> = ["b", "c"];

	const result = await board.runOnce({
		list: ["a", "b", "c"],
	});

	t.deepEqual(result["list"], outputList);
	t.is(result["item"], "a");
});
