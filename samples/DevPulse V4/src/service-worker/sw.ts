/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { Edge, RunResult, Schema } from "@google-labs/breadboard";
import { precacheAndRoute } from "workbox-precaching";
import board from "../lib/board";
import { ControllableAsyncGeneratorRunner } from "../lib/classes/ControllableAsyncGeneratorRunner";
import { SW_BROADCAST_CHANNEL } from "../lib/constants";
import { SendStatus } from "../lib/functions/SendStatus";
import { BroadcastChannelMember } from "../lib/types/BroadcastChannelMember";
import { BroadcastMessage, } from "../lib/types/BroadcastMessage";
import { BroadcastMessageType } from "../lib/types/BroadcastMessageType";
import { InputRequest } from "../lib/types/InputRequest";
import { RunnerState } from "../lib/types/RunnerState";

precacheAndRoute(self.__WB_MANIFEST || []);

export let boardRunner: ControllableAsyncGeneratorRunner<
	RunResult,
	unknown,
	unknown,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any,
	RunnerState
>;

self.addEventListener("install", () => {
	console.log("ServiceWorker", "install");

	boardRunner = new ControllableAsyncGeneratorRunner(
		(): AsyncGenerator<RunResult, unknown, unknown> => board.run(),
		handler,
		undefined,
		() => ({
			pendingInputs: {
				resolvers: {},
				requests: {}
			},
			active: false,
			paused: false,
			finished: false
		})
	);
	return self.skipWaiting();
});

self.addEventListener("activate", () => {
	console.log("ServiceWorker", "activate");
	return self.clients.claim();
});

const channel = new BroadcastChannel(SW_BROADCAST_CHANNEL);
channel.onmessage = (event): void => handleCommand(event.data);
self.addEventListener("message", (event: ExtendableMessageEvent): void =>
	handleCommand(event)
);

function handleCommand<M extends BroadcastMessage = BroadcastMessage>(
	message: M & ExtendableMessageEvent
) {
	console.debug("ServiceWorker", "message", message);
	if (message.messageSource !== BroadcastChannelMember.ServiceWorker) {
		if (message.messageType) {
			if (message.messageType === BroadcastMessageType.COMMAND) {
				switch (message.content) {
					case "start":
						if (!boardRunner) {
							boardRunner = new ControllableAsyncGeneratorRunner(
								(): AsyncGenerator<RunResult, unknown, unknown> => board.run(),
								handler
							);
						}
						boardRunner.start();
						break;
					case "pause":
						boardRunner.pause();
						break;
					case "stop":
						boardRunner.stop();
						break;
					default:
						throw new Error(`Unknown command: ${message.content}`);
				}
				// SendStatus(message.id);
			} else if (message.messageType === BroadcastMessageType.STATUS) {
				SendStatus(message.id);
			}
		}
	}
}

export function getInputSchemaFromNode(runResult: RunResult): Schema {
	let schema: Schema;
	const inputAttribute: string = runResult.state.newOpportunities.find(
		(op: Edge) => op.from == runResult.node.id
	)!.out!;

	const schemaFromOpportunity = {
		type: "object",
		properties: {
			[inputAttribute]: {
				title: inputAttribute,
				type: "string",
			},
		},
	};

	if (runResult.inputArguments.schema) {
		schema = runResult.inputArguments.schema as Schema;
		if (inputAttribute == "*") {
			return schema;
		}
		if (!Object.keys(schema.properties!).includes(inputAttribute)) {
			throw new Error(
				`Input attribute "${inputAttribute}" not found in schema:\n${JSON.stringify(
					schema,
					null,
					2
				)}`
			);
		}
	} else {
		schema = schemaFromOpportunity;
	}
	return schema;
}

export function getInputAttributeSchemaFromNodeSchema(schema: Schema): {
	key: string;
	schema: Schema;
} {
	const key = Object.keys(schema.properties!)[0];
	return {
		key,
		schema
	};
}

export function waitForInput(node: string, attrib: string): Promise<string> {
	return new Promise<string>((resolve) => {
		boardRunner.state.pendingInputs.resolvers[`${node}-${attrib}`] = resolve;
	});
}

async function handler(runResult: RunResult): Promise<void> {
	console.log("=".repeat(80));
	if (runResult.type === "input") {
		const inputSchema = getInputSchemaFromNode(runResult);
		const { key, schema } = getInputAttributeSchemaFromNodeSchema(inputSchema);

		const message: InputRequest = {
			id: `${runResult.node.id}-${key}`,
			messageType: BroadcastMessageType.INPUT_REQUEST,
			messageSource: BroadcastChannelMember.ServiceWorker,
			messageTarget: BroadcastChannelMember.Client,
			content: {
				node: runResult.node.id,
				attribute: key,
				schema,
			},
		};
		boardRunner.state.pendingInputs.requests[message.id] = message;
		SendStatus();

		new BroadcastChannel(SW_BROADCAST_CHANNEL).addEventListener("message", (event): void => {
			if (event.data.messageType === BroadcastMessageType.INPUT_RESPONSE) {
				if (event.data.content?.attribute == key && event.data.content?.node == runResult.node.id) {
					const { node, attribute, value } = event.data.content;
					boardRunner.state.pendingInputs.resolvers[`${node}-${attribute}`](value);
					delete boardRunner.state.pendingInputs.requests[message.id];
					SendStatus(message.id);
				}
			}
		})

		// SendStatus();

		const userInput = await waitForInput(runResult.node.id, key);
		runResult.inputs = { [key]: userInput };
	} else if (runResult.type === "output") {
		console.log(runResult.node.id, "output", runResult.outputs);
		const message: BroadcastMessage = {
			id: new Date().getTime().toString(),
			messageType: BroadcastMessageType.OUTPUT,
			messageSource: BroadcastChannelMember.ServiceWorker,
			messageTarget: BroadcastChannelMember.Client,
			content: runResult.outputs,
		};
		new BroadcastChannel(SW_BROADCAST_CHANNEL).postMessage(message);
	}
	await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, 1000));
}
