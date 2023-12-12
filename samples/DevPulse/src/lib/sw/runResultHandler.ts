import { RunResult } from "@google-labs/breadboard";
import {
	getInputSchemaFromNode,
	getInputAttributeSchemaFromNodeSchema,
} from "../getNodeInputSchema";
import { SW_CONTROL_CHANNEL } from "../constants";
import { waitForInput } from "lib/sw/waitForInput.ts";
import {
	ServiceWorkerInputRequestData,
	ServiceWorkerOutputData,
} from "./types";
import {
	BROADCAST_SOURCE,
	ServiceWorkerBroadcastData,
	ServiceWorkerBroadcastType,
} from "./types";

export function serviceWorkerOutputBroadcast(data: ServiceWorkerBroadcastData) {
	const channel = new BroadcastChannel(SW_CONTROL_CHANNEL);
	channel.postMessage(data);
}

export async function runResultHandler(runResult: RunResult): Promise<void> {
	console.debug("=".repeat(80));
	console.debug(runResult.node.id, runResult.type);

	if (runResult.type === "input") {
		const inputSchema = getInputSchemaFromNode(runResult);
		const { key, schema } = getInputAttributeSchemaFromNodeSchema(inputSchema);

		serviceWorkerOutputBroadcast({
			type: ServiceWorkerBroadcastType.INPUT_NEEDED,
			source: BROADCAST_SOURCE.SERVICE_WORKER,
			value: {
				node: runResult.node.id,
				attribute: key,
				schema,
			},
		} as ServiceWorkerInputRequestData);

		const userInput = await waitForInput(runResult.node.id, key);

		runResult.inputs = { [key]: userInput };
	} else if (runResult.type === "output") {
		console.debug(runResult.node.id, "output", runResult.outputs);

		serviceWorkerOutputBroadcast({
			type: ServiceWorkerBroadcastType.OUTPUT,
			source: BROADCAST_SOURCE.SERVICE_WORKER,
			value: {
				node: runResult.node.id,
				outputs: runResult.outputs,
			},
		} as ServiceWorkerOutputData);
		return;
	}
	await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, 1000));
}
export default runResultHandler;
