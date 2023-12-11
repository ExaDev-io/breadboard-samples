/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { Board, RunResult } from "@google-labs/breadboard";
import { precacheAndRoute } from "workbox-precaching";
// import { registerRoute } from "workbox-routing";
import { clientsClaim } from "workbox-core";

precacheAndRoute(self.__WB_MANIFEST || []);
self.skipWaiting();
clientsClaim();
// registerRoute(
// 	({ request }) => request.mode === "navigate",
// 	createHandlerBoundToURL("/index.html")
// );

self.addEventListener("install", () => {
	console.log("ServiceWorker", "install");
	return self.skipWaiting();
});
self.addEventListener("activate", () => {
	console.log("ServiceWorker", "activate");
	return self.clients.claim();
});

const board = new Board();
for (let i = 0; i < 10; i++) {
	board
		.input({ $id: `input_${i}` })
		.wire("*", board.output({ $id: `output_${i}` }));
}

const channel = new BroadcastChannel("gen-control");
channel.onmessage = (event) => handleCommand(event.data);
self.addEventListener("message", (event) => handleCommand(event.data));

let active = false;
let paused = false;

function handleCommand(data: { command: string }) {
	console.log("ServiceWorker", "message", data);
	switch (data.command) {
		case "start":
			if (!active) {
				console.debug("ServiceWorker", "starting");
				active = true;
				paused = false;
				runAsync(board.run(), handler).then(() => {
					channel.postMessage({ command: "done" });
				});
			} else if (paused) {
				console.debug("ServiceWorker", "resuming");
				paused = false;
				pausePromiseResolve();
			} else {
				console.warn("ServiceWorker", "already running");
			}
			break;
		case "pause":
			if (active) {
				console.debug("ServiceWorker", "pausing");
				paused = true;
			} else {
				console.warn("ServiceWorker", "not running");
			}
			break;
		case "stop":
			if (active) {
				console.debug("ServiceWorker", "stopping");
				active = false;
				paused = false;
				pausePromiseResolve();
			} else {
				console.warn("ServiceWorker", "not running");
			}
			break;
	}
}

let pausePromiseResolve: (value?: unknown) => void;

async function runAsync(
	run: AsyncGenerator<RunResult, unknown, unknown>,
	handler: (value: RunResult) => unknown
) {
	for await (const runResult of run) {
		if (!active) {
			break;
		}
		if (paused) {
			await new Promise((resolve) => {
				pausePromiseResolve = resolve;
			});
		}
		await handler(runResult);
	}
	paused = false;
	active = false;
}

async function handler(runResult: RunResult) {
	if (runResult.type === "input") {
		const input = {
			time: new Date().toISOString(),
		};
		console.log(runResult.node.id, "input", input);
		runResult.inputs = input;
	} else if (runResult.type === "output") {
		console.log(runResult.node.id, "output", runResult.outputs);
	}
	await new Promise((resolve) => setTimeout(resolve, 1000));
}
