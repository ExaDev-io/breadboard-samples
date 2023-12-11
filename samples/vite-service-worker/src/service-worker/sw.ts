/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { Board } from "@google-labs/breadboard";
import { precacheAndRoute } from "workbox-precaching";
// import { registerRoute } from "workbox-routing";

precacheAndRoute(self.__WB_MANIFEST || []);

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

let counter = 0;
setInterval(() => {
	console.log(new Date().toISOString(), counter++);
}, 1000);

(async () => {
	const board = new Board();
	for (let i = 0; i < 100; i++) {
		board.input({ $id: `input_${i}` }).wire("*", board.output());
	}

	for await (const runResult of board.run()) {
		console.log("=".repeat(80));
		console.log(runResult.node.id);

		if (runResult.type == "input") {
			runResult.inputs = {
				message: new Date().toISOString(),
			};
		} else if (runResult.type == "output") {
			console.log("output", runResult.outputs);
		}
	}
})().catch((error) => {
	console.error(error);
});
