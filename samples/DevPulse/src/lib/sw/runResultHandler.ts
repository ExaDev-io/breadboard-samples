import { RunResult } from "@google-labs/breadboard";
import {
	getInputSchemaFromNode,
	getInputAttributeSchemaFromNodeSchema,
} from "../getNodeInputSchema";
import { SW_CONTROL_CHANNEL } from "../constants";
import { waitForInput } from "lib/sw/waitForInput.ts";
import { Stories } from "~/core/Stories";
import { StoryOutput } from "~/hnStory/domain";

export async function runResultHandler(runResult: RunResult): Promise<void> {
	console.debug("=".repeat(80));
	console.debug(runResult.node.id, runResult.type);

	const broadcastChannel: BroadcastChannel = new BroadcastChannel(
		SW_CONTROL_CHANNEL
	);
	
	const ignoredOutputNodeIds = [
		"testCompletion",
		"algoliaSearchUrl",
		"postSummarisation",
	];

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
		broadcastChannel.postMessage({
			type: "inputReceived",
			node: runResult.node.id,
			attribute: key,
			schema,
			message: `Node "${runResult.node.id}" has been added`,
		});

		runResult.inputs = { [key]: userInput };
	} else if (runResult.type === "output") {
		console.log(runResult.outputs);
		if (runResult.outputs?.story_id) {
			const id = runResult.outputs.story_id as number;
			Stories.add(id, runResult.outputs);
		} else if (ignoredOutputNodeIds.includes(runResult.node.id)) {
			//
		} else {
			throw new Error(`node: ${runResult.node.id}`);
		}
		const output = {
			output: Stories.getAll() as StoryOutput[],
		};
		console.log(output);
		broadcastChannel.postMessage(output);
	}
	await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, 1000));
}
export default runResultHandler;
