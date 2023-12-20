import { Board, Schema } from "@google-labs/breadboard";
import { HTMLInputTypeAttribute } from "react";


type EnhancedSchema = Schema & {
	type: HTMLInputTypeAttribute;
};
const board = new Board();

// for (let i = 0; i < 3; i++) {
// 	board
// 		.input({ $id: `input_${i}` })
// 		.wire(`message_${i}`, board.output({ $id: `output_${i}` }));
// }

const schema2: EnhancedSchema = {
	type: "object",
	properties: {
		"message_2": {
			title: "Message 2",
			type: "string",
		},
	},
};

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

board.input({ $id: `input_1`, }).wire(`message_1`, board.output({ $id: `output_1` }));
board.input({ $id: `input_2`, schema: schema2 }).wire(`message_2`, board.output({ $id: `output_2` }));

board.input({ $id: `input_3` }).wire(`message_3`, board.output({ $id: `output_3` }));
board.input({ $id: `input_3` }).wire(`message_4`, board.output({ $id: `output_3` }));

board.input({ $id: `multi_input_1`, schema: multi_input }).wire(`*`, board.output({ $id: `multi_output_1` }));

const multi_input_2 = board.input({ $id: `multi_input_2`, schema: multi_input });

const multiOutput2 = board.output({ $id: `multi_output_2` });

multi_input_2.wire(`message_1`, multiOutput2);
multi_input_2.wire(`message_2`, multiOutput2);

export default board;
