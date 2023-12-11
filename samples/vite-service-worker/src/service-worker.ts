/// <reference lib="webworker" />

import { Board } from "@google-labs/breadboard";

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("fetch", (event: FetchEvent) => {
	console.log("ServiceWorker", "fetch", event);
	event.respondWith(fetch(event.request));
});

self.addEventListener("install", (event: ExtendableEvent) => {
	console.log("ServiceWorker", "install", event);
});

// add a persistent infinite loop that prints a counter every second
let counter = 0;
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
					time: new Date().toISOString(),
				};
			} else if (runResult.type == "output") {
				console.log("output", runResult.outputs);
			}
		}
	}
})().catch((error) => {
	console.error(error);
});

export {};
