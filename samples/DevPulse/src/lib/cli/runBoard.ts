#!/usr/bin/env tsx
import { generateAndWriteCombinedMarkdown } from "@exadev/breadboard-kits/src/util/files/generateAndWriteCombinedMarkdown.js";
import { RunResult } from "@google-labs/breadboard";
import board from "../../breadboard/index";
import { CliAsyncGeneratorRunner } from "./cliAsyncGeneratorRunner";
import { cliRunResultHandler } from "./cliRunResultHandler";

generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
});

new CliAsyncGeneratorRunner(
	(): AsyncGenerator<RunResult, unknown> => board.run(),
	cliRunResultHandler
).run();
