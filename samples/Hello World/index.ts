import { Board, Schema } from "@google-labs/breadboard";

const board = new Board();

const inputSchema = {
    type: "object",
    properties: {
		message: {
        type: "string",
        title: "Hello Message",
        description: "The input message saying hello"
      }
    }
  } satisfies Schema

board.input({
  $id: "input-message",
  schema: inputSchema
}).wire("message", board.output());

(async () => {
	console.log(
		await board.runOnce({
			message: "Hello Breadboard!",
		})
	);
})();
