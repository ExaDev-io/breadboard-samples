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

function handleCommand(data: { command: string }) {
	console.log("ServiceWorker", "message", data);
	switch (data.command) {
		case "start":
			boardRunner.start();
			break;
		case "pause":
			boardRunner.pause();
			break;
		case "stop":
			boardRunner.stop();
			break;
	}
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

class ControllableAsyncGeneratorRunner<
	TReturn,
	TNext,
	TNextReturn,
	TGenerateParams
> {
	private pausePromiseResolve: undefined | ((value?: unknown) => void);
	private instance: AsyncGenerator<TReturn, TNext, TNextReturn> | undefined;
	private paused = false;

	constructor(
		private readonly generator: (
			params?: TGenerateParams
		) => AsyncGenerator<TReturn, TNext, TNextReturn>,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private readonly handler: (value: TReturn) => any,
		private readonly generatorParams?: TGenerateParams
	) {
		this.generator = generator;
		this.handler = handler;
	}

	run() {
		if (this.instance) {
			const instance = this.instance;
			const handler = this.handler;
			(async () => {
				try {
					let next = await instance.next();
					while (!next.done) {
						if (this.paused) {
							await new Promise((resolve) => {
								this.pausePromiseResolve = resolve;
							});
						}
						await handler(next.value);
						next = await instance.next();
					}
				} catch (error) {
					console.error(error);
					this.stop();
				}
			})();
		} else {
			throw new Error("No generator instance");
		}
	}
	start() {
		if (!this.instance) {
			console.debug("ServiceWorker", "starting");
			this.instance = this.generator(this.generatorParams);
			this.run();
		} else if (this.paused) {
			console.debug("ServiceWorker", "resuming");
			this.paused = false;
			if (this.pausePromiseResolve) {
				this.pausePromiseResolve();
				this.pausePromiseResolve = undefined;
			}
		} else {
			console.warn("ServiceWorker", "already running");
		}
	}
	pause() {
		this.paused = true;
	}
	stop() {
		if (this.instance) {
			console.debug("ServiceWorker", "stopping");
			this.paused = false;
			if (this.pausePromiseResolve) {
				this.pausePromiseResolve();
				this.pausePromiseResolve = undefined;
			}
			this.instance = undefined;
		} else {
			console.warn("ServiceWorker", "not running");
		}
	}
}

const boardRunner = new ControllableAsyncGeneratorRunner(board.run, handler);
