// @/src/sw/worker.ts

/// <reference lib="webworker" />

import { cleanString } from "util/CleanString";
import { ignoredOutputs } from "util/IgnoredOutputs";
import board from "../hackerNewsBoard";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const self: DedicatedWorkerGlobalScope;

// export const callBlockingFunction = () => {
// 	blockingFunc();
// };

self.addEventListener('message', async (event) => {
	const { CLAUDE_API_KEY, defaultQuery } = event.data;
	if (event.data.type === 'startProcessing') {
		for await (const run of board.run()) {
			if (run.type === "input") {
				if (run.node.id === "claudeApiKey") {
					run.inputs = { CLAUDE_API_KEY };
				} else if (run.node.id === "searchQuery") {
					run.inputs = { query: defaultQuery };
				} else {
					self.postMessage({ type: 'inputRequest', nodeId: run.node.id });
				}
			} else if (run.type === "output") {
				const outputMessage = cleanString(run); // Ensure cleanString function is defined in the worker
				console.log(outputMessage);
				if (ignoredOutputs.includes(run.node.id)) {
					continue;
				}

				self.postMessage({ type: 'output', message: outputMessage });
			} else {
				console.debug(run.node.id, run); // Debugging in workers goes to the console of your browser's Developer Tools
			}
		}
	}
});
