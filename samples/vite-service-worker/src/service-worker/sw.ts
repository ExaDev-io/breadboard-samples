/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { Board, RunResult } from "@google-labs/breadboard";
import { precacheAndRoute } from "workbox-precaching";

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
for (let i = 0; i < 10; i++) {
	board
		.input({ $id: `input_${i}` })
		.wire("*", board.output({ $id: `output_${i}` }));
}

const channel = new BroadcastChannel("gen-control");
channel.onmessage = (event): void => handleCommand(event.data);
self.addEventListener("message", (event): void => handleCommand(event.data));

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

async function handler(runResult: RunResult): Promise<void> {
	console.log("=".repeat(80));
	if (runResult.type === "input") {
		const input = {
			time: new Date().toISOString(),
		};
		console.log(runResult.node.id, "input", input);
		runResult.inputs = input;
	} else if (runResult.type === "output") {
		console.log(runResult.node.id, "output", runResult.outputs);
	}
	await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, 1000));
}

class ControllableAsyncGeneratorRunner<
	TReturn,
	TNext,
	TNextReturn,
	TGenerateParams
> {
	private pausePromiseResolve: undefined | ((value?: unknown) => void);
	private paused: boolean = false;
	private active: boolean = false;

	constructor(
		private readonly generatorGenerator: (
			params?: TGenerateParams
		) => AsyncGenerator<TReturn, TNext, TNextReturn>,
		private readonly handler: (value: TReturn) => unknown,
		private readonly generatorParams?: TGenerateParams
	) {}

	run(): void {
		const generator = this.generatorGenerator(this.generatorParams);
		const handler = this.handler;
		this.active = true;
		this.paused = false;
		(async (): Promise<void> => {
			try {
				let next = await generator.next();
				while (this.active && !next.done) {
					if (this.paused) {
						await new Promise((resolve): void => {
							this.pausePromiseResolve = resolve;
						});
					}
					await handler(next.value);
					next = await generator.next();
				}
				console.debug("ServiceWorker", "generator done");
			} catch (error) {
				console.error(error);
			} finally {
				this.stop();
			}
		})();
	}

	start(): void {
		if (!this.active) {
			this.active = true;
			this.paused = false;
			this.run();
		} else if (this.paused) {
			this.paused = false;
			this.pausePromiseResolve?.();
		}
	}

	pause(): void {
		this.paused = true;
	}

	stop() {
		if (this.active) {
			this.active = false;
			this.paused = false;
			this.pausePromiseResolve?.();
		}
	}
}
