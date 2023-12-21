import { Board, Schema } from "@google-labs/breadboard";
import { HTMLInputTypeAttribute } from "react";
import { ValidHTMLInputTypeAttributes } from "./types/ValidHTMLInputTypeAttributes";

type EnhancedSchema = Schema & {
	type: HTMLInputTypeAttribute;
};

const board = new Board();

// for (let i = 0; i < 3; i++) {
// 	board
// 		.input({ $id: `input_${i}` })
// 		.wire(`message_${i}`, board.output({ $id: `output_${i}` }));
// }

/* const schema2: EnhancedSchema = {
	type: "object",
	properties: {
		"message_2": {
			title: "Message 2",
			type: "string",
		},
	},
}; */

const multi_input: EnhancedSchema = {
	type: "object",
	properties: {
		"message_1": {
			title: "Message 1",
			type: "string",
		},
		"message_2": {
			title: "Message 2",
			type: "string",
		},
	},
};

/* board.input({
	schema: {
		type: "object",
		properties: {
			"message_1": {
				title: "Message 1",
				type: "string",
			},
			"message_2": {
				title: "Message 2",
				type: "string",
			},
		},
	}
}).wire(`*`, board.output()); */

//board.input({ $id: `input_1`, }).wire(`message_1`, board.output({ $id: `output_1` }));
//board.input({ $id: `input_2`, schema: schema2 }).wire(`message_2`, board.output({ $id: `output_2` }));

//board.input({ $id: `input_3` }).wire(`message_3`, board.output({ $id: `output_3` }));
//board.input({ $id: `input_3` }).wire(`message_4`, board.output({ $id: `output_3` }));

board.input({ $id: `multi_input_1`, schema: multi_input }).wire(`*`, board.output({ $id: `multi_output_1` }));

const multiInput = board.input({ $id: `multi_input_2`, schema: multi_input });

const multiOutput = board.output({ $id: `multi_output_2` });

multiInput.wire(`message_1`, multiOutput);
multiInput.wire(`message_2`, multiOutput);

board.input({
	schema: {
		type: "object",
		properties: ValidHTMLInputTypeAttributes.reduce((acc: { [key: string]: EnhancedSchema; }, curr) => {
			acc[curr] = {
				title: curr,
				type: curr
			};
			return acc;
		}, {})
	}
}).wire(`*`, board.output({ $id: `output_all_types` }));


export default board;
