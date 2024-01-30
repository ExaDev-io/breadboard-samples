import { Board } from "@google-labs/breadboard";
import test from "ava";
import ListKit from "../../../../src/kits/ListKit.js";

test("listKit.pop", async (t) => {
	const board: Board = new Board();
	const listKit = board.addKit(ListKit);

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
		inputs: {
			list: ["a", "b", "c"],
		},
	});

	const pop = listKit.pop();
	list.wire("->list", pop);
	pop.wire("->list", pop);

	const output = board.output();
	pop.wire("->item", output);

	const result = await board.runOnce({
		list: ["a", "b", "c"],
	});

	t.is(result["item"], "c");
});
