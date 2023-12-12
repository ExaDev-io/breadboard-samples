/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { RunResult } from "@google-labs/breadboard";
import { precacheAndRoute } from "workbox-precaching";
import {
	BROADCAST_TARGET,
	BroadcastEvent,
	ClientBroadcastData,
} from "../lib/sw/types";
import board from "../breadboard/index";
import { SW_CONTROL_CHANNEL } from "../lib/constants";
import commandHandler from "../lib/sw/commandHandler";
import ControllableAsyncGeneratorRunner from "../lib/sw/controllableAsyncGeneratorRunner";
import runResultHandler from "../lib/sw/runResultHandler";

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
channel.onmessage = (event: BroadcastEvent): void => {
	if (
		event.data.target &&
		event.data.target === BROADCAST_TARGET.SERVICE_WORKER
	) {
		return commandHandler(event.data as ClientBroadcastData);
	} else {
		console.debug("ServiceWorker", "ignoring", "BroadcastEvent", event.data);
	}
};
