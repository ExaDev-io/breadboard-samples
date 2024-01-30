import { Board } from "@google-labs/breadboard";
import test from "ava";
import ListKit from "../../../../src/kits/ListKit.js";
import { splitDelimiter } from "../../../../src/types/list.js";

test("litkit.split", async (t) => {
	const board = new Board({
		title: "Exadev",
		description: "Exadev Breadboard Kit",
		version: "0.0.1",
	});
	const listKit = board.addKit(ListKit);

	const string = board.input({
		$id: "input",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "string",
					description: "string",
				},
			},
		},
	});

	const bool = board.input({
		$id: "input",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "boolean",
					title: "bool",
					description: "bool",
				},
			},
		},
	});

	const split = listKit.split();
	string.wire("->input", split);
	string.wire("->delimiter", split);
	bool.wire("->split_by_each", split);
	bool.wire("->remove_empty_text", split);
	bool.wire("->trim_items", split);
	bool.wire("->keep_delimiters", split);
	string.wire("->output_format", split);

	const output = board.output();
	split.wire("values->", output);

	const inputString = "this, is some, text";
	const inputString2 = "this,,";
	// a little more complex, use regex for multiple delimiters [.?!]
	const input_string3 =
		"Hello this is my first sentence. This is me? Hello this is my second sentence!";

	const expectedOut: Array<string> = ["this", " is some", " text"];
	const expectedOut2: Array<string> = ["this", "is some", "text"];
	const expectedOut3: Array<string> = [
		"t",
		"h",
		"i",
		"s",
		" ",
		"i",
		"s",
		" ",
		"s",
		"o",
		"m",
		"e",
		" ",
		"t",
		"e",
		"x",
		"t",
	];
	const expectedOut4: Array<string> = ["this"];
	const expectedOut5: Array<string> = ["this,", " is some,", " text"];
	const expectedOut6: Array<string> = [
		"Hello this is my first sentence.",
		" This is me?",
		" Hello this is my second sentence!",
	];

	const myDelim: splitDelimiter = {
		delimiter: ",",
	};
	// regex equivalent to "," delimeter
	const myDelim2: splitDelimiter = {
		regex: /,/.source,
	};
	// split using regex, but does not keep delimiters [.?!]
	const myDelim3: splitDelimiter = {
		regex: /[.?!]/.source,
	};

	// split using regex and keeps the delimiters [.?!], keep_delimiters flag should have no effect
	const myDelim4: splitDelimiter = {
		regex: /(?<=[.?!])/.source,
	};

	// no flags, just split normally with delimiter
	const result = await board.runOnce({
		input: inputString,
		delimiter: myDelim,
		trim: false,
		split_by_each: false,
		remove_empty_text: false,
		trim_items: false,
		keep_delimiters: false,
		output_format: "string_array",
	});

	// split each word into characters
	// essentially recursively calls string.Split("") on substrings
	const result3 = await board.runOnce({
		input: inputString,
		delimiter: myDelim,
		split_by_each: true,
		remove_empty_text: false,
		trim_items: false,
		keep_delimiters: false,
		output_format: "string_array",
	});

	// remove empty words (text.length == 0)
	const result4 = await board.runOnce({
		input: inputString2,
		delimiter: myDelim,
		split_by_each: false,
		remove_empty_text: true,
		trim_items: false,
		keep_delimiters: false,
		output_format: "string_array",
	});

	// trim trailing and leading whitespace characters
	const result5 = await board.runOnce({
		input: inputString,
		delimiter: myDelim,
		split_by_each: false,
		remove_empty_text: false,
		trim_items: true,
		keep_delimiters: false,
		output_format: "string_array",
	});

	// split string, but keep delimiters
	const results6 = await board.runOnce({
		input: inputString,
		delimiter: myDelim,
		split_by_each: false,
		remove_empty_text: false,
		trim_items: false,
		keep_delimiters: true,
		output_format: "string_array",
	});

	// return as object array
	const results7 = await board.runOnce({
		input: inputString,
		delimiter: myDelim,
		split_by_each: false,
		remove_empty_text: false,
		trim_items: false,
		keep_delimiters: false,
		output_format: "object_array",
	});

	const results8 = await board.runOnce({
		input: inputString,
		delimiter: myDelim2,
		split_by_each: false,
		remove_empty_text: false,
		trim_items: false,
		keep_delimiters: false,
		output_format: "string_array",
	});

	// split by regex, original delimiters are not kept by regex
	const results9 = await board.runOnce({
		input: input_string3,
		delimiter: myDelim3,
		split_by_each: false,
		remove_empty_text: false,
		trim_items: false,
		keep_delimiters: true,
		output_format: "string_array",
	});

	// split by regex, original regex keeps delimiters
	// so "keep_delimeters" should have no effect on the output
	const results10 = await board.runOnce({
		input: input_string3,
		delimiter: myDelim4,
		split_by_each: false,
		remove_empty_text: false,
		trim_items: false,
		keep_delimiters: true,
		output_format: "string_array",
	});

	t.deepEqual(result.values, expectedOut);
	t.deepEqual(result3.values, expectedOut3);
	t.deepEqual(result4.values, expectedOut4);
	t.deepEqual(result5.values, expectedOut2);
	t.deepEqual(results6.values, expectedOut5);
	t.deepEqual(results7.values, expectedOut);
	t.deepEqual(results8.values, expectedOut);
	t.deepEqual(results9.values, expectedOut6);
	t.deepEqual(results10.values, expectedOut6);
});
