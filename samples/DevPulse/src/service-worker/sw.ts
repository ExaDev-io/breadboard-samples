/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { RunResult } from "@google-labs/breadboard";
import { precacheAndRoute } from "workbox-precaching";
import { SW_BROADCAST_CHANNEL } from "../lib/constants";
import { BroadcastMessage } from "../lib/types/BroadcastMessage";
import { BroadcastMessageType } from "../lib/types/BroadcastMessageType";
import { InputRequest } from "../lib/types/InputRequest";
import { BroadcastChannelMember } from "../lib/types/BroadcastChannelMember";
import {getInputSchemaFromNode, getInputAttributeSchemaFromNodeSchema} from "./getNodeInputSchema";
import { ControllableAsyncGeneratorRunner } from "../lib/classes/ControllableAsyncGeneratorRunner";
import { RunnerState } from "~/lib/types/RunnerState";
import SendStatus from "../lib/functions/SendStatus";
import board from "../breadboard/index";
import { Stories } from "../core/Stories";
import { StoryOutput } from "~/hnStory/domain";

precacheAndRoute(self.__WB_MANIFEST || []);

export let boardRunner: ControllableAsyncGeneratorRunner<
	RunResult,
	unknown,
	unknown,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any,
	RunnerState
>;

const ignoredOutputNodeIds = [
	"testCompletion",
	"algoliaSearchUrl",
	"postSummarisation",
	"searchInProgress",
];

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

		const userInput = await waitForInput(runResult.node.id, key);

		runResult.inputs = { [key]: userInput };
	} else if (runResult.type === "output") {
		if (runResult.outputs?.story_id) {
			const id = runResult.outputs.story_id as number;
			Stories.add(id, runResult.outputs);
			console.log(runResult.outputs);
		} else if (ignoredOutputNodeIds.includes(runResult.node.id)) {
			console.debug(runResult.outputs);
		} else if (runResult.node.id === "searchResults") {
			throw new Error(`node: ${runResult.node.id}`);
		}
		const output = Stories.getAll() as StoryOutput[];
		const message: BroadcastMessage = {
			messageType: BroadcastMessageType.OUTPUT,
			messageSource: BroadcastChannelMember.ServiceWorker,
			messageTarget: BroadcastChannelMember.Client,
			content: {
				node: runResult.node.id,
				outputs: output,
				...runResult.outputs,
			}
		};
		new BroadcastChannel(SW_BROADCAST_CHANNEL).postMessage(message);
	}
	await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, 1000));
}

