#!/usr/bin/env tsx
import { generateAndWriteCombinedMarkdown } from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { RunResult } from "@google-labs/breadboard";
import { CliAsyncGeneratorRunner } from "~/lib/cliAsyncGeneratorRunner.ts";
import { cliRunResultHandler } from "~/lib/cliRunResultHandler.ts";
import board from "../breadboard/index";

// for await (const runResult of board.run()) {}

// let runResult = await boardRun.next();
// while (!runResult.done) {
// 	await runResultHandler(runResult.value);
// 	runResult = await boardRun.next();
// }

generateAndWriteCombinedMarkdown({
// @ts-ignore
	board,
	filename: "README",
});

new CliAsyncGeneratorRunner(
	(): AsyncGenerator<RunResult, unknown> => board.run(),
	cliRunResultHandler
).run();
