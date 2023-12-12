import { RunResult } from "@google-labs/breadboard";
import {
	getInputSchemaFromNode,
	getInputAttributeSchemaFromNodeSchema,
} from "../getNodeInputSchema";
import { SW_CONTROL_CHANNEL } from "../constants";
import { waitForInput } from "lib/sw/waitForInput.ts";

export async function runResultHandler(runResult: RunResult): Promise<void> {
	console.debug("=".repeat(80));
	console.debug(runResult.node.id, runResult.type);

	const broadcastChannel: BroadcastChannel = new BroadcastChannel(
		SW_CONTROL_CHANNEL
	);

	if (runResult.type === "input") {
		const inputSchema = getInputSchemaFromNode(runResult);
		const { key, schema } = getInputAttributeSchemaFromNodeSchema(inputSchema);

		broadcastChannel.postMessage({
			type: "inputNeeded",
			node: runResult.node.id,
			attribute: key,
			schema,
			message: `Node "${runResult.node.id}" requires input "${schema.title} (${key})" of type "${schema.type}"`,
		});

		const userInput = await waitForInput(runResult.node.id, key);

		runResult.inputs = { [key]: userInput };
	} else if (runResult.type === "output") {
		console.log(runResult.node.id, "output", runResult.outputs);
	}
	await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, 1000));
}
export default runResultHandler;
