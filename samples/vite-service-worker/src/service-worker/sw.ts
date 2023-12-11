/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { Board } from "@google-labs/breadboard";
import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";

precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
	({ request }) => request.mode === "navigate",
	createHandlerBoundToURL("/index.html")
);

self.addEventListener("install", () => {
	console.log("ServiceWorker", "install");
	return self.skipWaiting();
});
self.addEventListener("activate", () => {
	console.log("ServiceWorker", "activate");
	return self.clients.claim();
});

let counter = 0;
setInterval(() => {
	console.log(new Date().toISOString(), counter++);
}, 1000);

setInterval(() => {
	console.log(new Date().toISOString(), counter++);
}, 1000);

(async () => {
	const board = new Board();
	const output = board.output();
	board.input({ $id: "one" }).wire("*", output);
	board.input({ $id: "two" }).wire("*", output);
	board.input({ $id: "three" }).wire("*", output);

	let boardCounter = 0;
	const LIMIT = 100;

	while (boardCounter++ < LIMIT) {
		for await (const runResult of board.run()) {
			console.log("=".repeat(80));
			console.log(runResult.node.id);

			if (runResult.type == "input") {
				runResult.inputs = {
					[`input_${boardCounter}`]: new Date().toISOString(),
				};
			} else if (runResult.type == "output") {
				console.log("output", runResult.outputs);
			}
		}
	}
})().catch((error) => {
	console.error(error);
});
