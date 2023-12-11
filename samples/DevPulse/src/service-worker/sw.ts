/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { RunResult } from "@google-labs/breadboard";
import { precacheAndRoute } from "workbox-precaching";
import board from '../breadboard/index';
import runResultHandler from '../lib/sw/runResultHandler';
import ControllableAsyncGeneratorRunner from '../lib/sw/controllableAsyncGeneratorRunner';
import { SW_CONTROL_CHANNEL } from '../lib/constants';
import commandHandler from '../lib/sw/commandHandler';

precacheAndRoute(self.__WB_MANIFEST || []);

export let boardRunner: ControllableAsyncGeneratorRunner<
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
		runResultHandler
	);

	return self.skipWaiting();
});

self.addEventListener("activate", () => {
	console.log("ServiceWorker", "activate");
	return self.clients.claim();
});

const channel = new BroadcastChannel(SW_CONTROL_CHANNEL);
channel.onmessage = (event: MessageEvent): void => commandHandler(event.data);
// self.addEventListener("message", (event: ExtendableMessageEvent): void =>
// 	commandHandler(event.data)
// );
