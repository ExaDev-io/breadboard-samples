#!/usr/bin/env tsx
import { generateAndWriteCombinedMarkdown } from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { RunResult } from "@google-labs/breadboard";
import { CliAsyncGeneratorRunner } from "./cliAsyncGeneratorRunner";
import { cliRunResultHandler } from "./cliRunResultHandler.ts";
import board from "../../breadboard/index";

// for await (const runResult of board.run()) {}

// let runResult = await boardRun.next();
// while (!runResult.done) {
// 	await runResultHandler(runResult.value);
// 	runResult = await boardRun.next();
// }

generateAndWriteCombinedMarkdown({
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	board,
	filename: "README",
});

new CliAsyncGeneratorRunner(
	(): AsyncGenerator<RunResult, unknown> => board.run(),
	cliRunResultHandler
).run();
