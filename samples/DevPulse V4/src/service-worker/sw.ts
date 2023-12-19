/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { Board, RunResult } from "@google-labs/breadboard";
import { precacheAndRoute } from "workbox-precaching";
import { BroadcastChannelMember } from "../lib/BroadcastChannelMember";
import {
	BroadcastMessage,
	BroadcastMessageTypes,
} from "../lib/BroadcastMessage";
import { ControllableAsyncGeneratorRunner } from "../lib/ControllableAsyncGeneratorRunner";
import { ServiceWorkerStatus } from "../lib/ServiceWorkerStatus";
import { SW_BROADCAST_CHANNEL } from "../lib/constants";

precacheAndRoute(self.__WB_MANIFEST || []);

let boardRunner: ControllableAsyncGeneratorRunner<
	RunResult,
	unknown,
	unknown,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any
>;

self.addEventListener("install", () => {
	console.log("ServiceWorker", "install");

	boardRunner = new ControllableAsyncGeneratorRunner(
		(): AsyncGenerator<RunResult, unknown, unknown> => board.run(),
		handler
	);
	return self.skipWaiting();
});

self.addEventListener("activate", () => {
	console.log("ServiceWorker", "activate");
	return self.clients.claim();
});

const board = new Board();
for (let i = 0; i < 3; i++) {
	board
		.input({ $id: `input_${i}` })
		.wire("*", board.output({ $id: `output_${i}` }));
}

const channel = new BroadcastChannel(SW_BROADCAST_CHANNEL);
channel.onmessage = (event): void => handleCommand(event.data);
self.addEventListener("message", (event: ExtendableMessageEvent): void =>
	handleCommand(event)
);

function handleCommand<M extends BroadcastMessage = BroadcastMessage>(
	message: M & ExtendableMessageEvent
) {
	console.log("ServiceWorker", "message", message);
	if (message.messageSource !== BroadcastChannelMember.ServiceWorker) {
		if (message.messageType) {
			if (message.messageType === BroadcastMessageTypes.COMMAND) {
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
				broadcastStatus<M>(message);
			} else if (message.messageType === BroadcastMessageTypes.STATUS) {
				broadcastStatus<M>(message);
			}
		}
	}
}

function broadcastStatus<M extends BroadcastMessage = BroadcastMessage>(message: M & ExtendableMessageEvent) {
	const content: ServiceWorkerStatus = {
		active: boardRunner?.active ?? false,
		paused: boardRunner?.paused ?? false,
		finished: boardRunner?.finished ?? false,
	};
	const response: BroadcastMessage = {
		id: message.id,
		messageType: BroadcastMessageTypes.STATUS,
		messageSource: BroadcastChannelMember.ServiceWorker,
		content,
	};
	channel.postMessage(response);
}

async function handler(runResult: RunResult): Promise<void> {
	console.log("=".repeat(80));
	if (runResult.type === "input") {
		const input = {
			node: runResult.node.id,
		};
		console.log(runResult.node.id, "input", input);
		runResult.inputs = input;
	} else if (runResult.type === "output") {
		console.log(runResult.node.id, "output", runResult.outputs);
		const message: BroadcastMessage = {
			id: new Date().getTime().toString(),
			messageType: BroadcastMessageTypes.OUTPUT,
			messageSource: BroadcastChannelMember.ServiceWorker,
			messageTarget: BroadcastChannelMember.Client,
			content: runResult.outputs,
		};
		new BroadcastChannel(SW_BROADCAST_CHANNEL).postMessage(message);
	}
	await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, 1000));
}
