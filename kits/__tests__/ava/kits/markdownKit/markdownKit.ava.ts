import { Board } from "@google-labs/breadboard";
import test from "ava";
import { ListKit, MarkdownKit } from "../../../../src/index.js";

test("markdownkit.generateCombinedMarkdown", async (t) => {
	const board = new Board({
		title: "Markdown Kit Combined",
		description: "Exadev Markdown Kit Combined Test",
		version: "0.0.1",
	});
	const markdownKit = board.addKit(MarkdownKit);

	const input = board.input({
		$id: "board",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input2 = board.input({
		$id: "filename",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input3 = board.input({
		$id: "title",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input4 = board.input({
		$id: "directory",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const generateCombinedMarkdown = markdownKit.generateCombinedMarkdown();
	input.wire("->boardjson", generateCombinedMarkdown);
	input2.wire("->filename", generateCombinedMarkdown);
	input3.wire("->title", generateCombinedMarkdown);
	input4.wire("->dir", generateCombinedMarkdown);

	const boardjson = JSON.stringify(board, null, "\t");
	// doesn't return anything, just writes to disk
	await board.runOnce({
		boardjson: boardjson,
		filename: board.title,
		title: board.title,
		dir: "./tests/kits/markdownKit",
	});

	// void function
	t.is(true, true);
});

test("markdownkit.generateJson", async (t) => {
	const board = new Board({
		title: "Markdown Kit Json",
		description: "Exadev Markdown Kit Json Test",
		version: "0.0.1",
	});

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const markdownKit = board.addKit(MarkdownKit);

	const input = board.input({
		$id: "board",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input2 = board.input({
		$id: "filename",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input3 = board.input({
		$id: "title",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input4 = board.input({
		$id: "directory",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const generateJson: MarkdownKit = markdownKit.generateJson();
	input.wire("->boardjson", generateJson);
	input2.wire("->filename", generateJson);
	input3.wire("->title", generateJson);
	input4.wire("->dir", generateJson);

	const boardjson = JSON.stringify(board, null, "\t");
	// doesn't return anything, just writes to disk
	await board.runOnce({
		boardjson: boardjson,
		filename: board.title,
		title: board.title,
		dir: "./tests/kits/markdownKit",
	});

	// void function
	t.is(true, true);
});

test("markdownkit.generateMermaid", async (t) => {
	const board = new Board({
		title: "Markdown Kit Mermaid",
		description: "Exadev Markdown Kit Mermaid Test",
		version: "0.0.1",
	});

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const markdownKit = board.addKit(MarkdownKit);

	const input = board.input({
		$id: "board",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input2 = board.input({
		$id: "filename",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input3 = board.input({
		$id: "title",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input4 = board.input({
		$id: "directory",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const generateMermaid = markdownKit.generateMermaid();
	input.wire("->boardjson", generateMermaid);
	input2.wire("->filename", generateMermaid);
	input3.wire("->title", generateMermaid);
	input4.wire("->dir", generateMermaid);

	const boardjson = JSON.stringify(board, null, "\t");

	await board.runOnce({
		boardjson: boardjson,
		filename: board.title,
		title: board.title,
		dir: "./tests/kits/markdownKit",
	});

	// void function
	t.is(true, true);
});

// test markdown works when more than 1 kit is added to a board
test("markdownkit.anotherBoard", async (t) => {
	const board = new Board({
		title: "Markdown Kit Multi-kit",
		description: "Exadev Markdown Kit Multi-kit Test",
		version: "0.0.1",
	});
	const listKit = board.addKit(ListKit);
	const markdownKit = board.addKit(MarkdownKit);

	const input = board.input({
		$id: "input",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const concat = listKit.concat();
	input.wire("->a", concat);
	input.wire("->b", concat);

	const output = board.output();
	concat.wire("list->", output);

	const result = await board.runOnce({
		a: ["hello"],
		b: ["John"],
	});

	t.deepEqual(result["list"], ["hello", "John"]);

	const input1 = board.input({
		$id: "board",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input2 = board.input({
		$id: "filename",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input3 = board.input({
		$id: "title",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input4 = board.input({
		$id: "directory",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const generateCombinedMarkdown = markdownKit.generateCombinedMarkdown();
	input1.wire("->boardjson", generateCombinedMarkdown);
	input2.wire("->filename", generateCombinedMarkdown);
	input3.wire("->title", generateCombinedMarkdown);
	input4.wire("->dir", generateCombinedMarkdown);

	const boardjson = JSON.stringify(board, null, "\t");

	await board.runOnce({
		boardjson: boardjson,
		filename: board.title,
		title: board.title,
		dir: "./tests/kits/markdownKit",
	});
});
