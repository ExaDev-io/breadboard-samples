#!/usr/bin/env tsx
// import { generateAndWriteCombinedMarkdown } from "@exadev/breadboard-kits/src/util/files/generateAndWriteCombinedMarkdown.js";
import { BoardRunner, RunResult, asRuntimeKit } from "@google-labs/breadboard";
import { CliAsyncGeneratorRunner } from "./cliAsyncGeneratorRunner";
import { cliRunResultHandler } from "./cliRunResultHandler";
import Core from "@google-labs/core-kit";
import { ClaudeKitBuilder } from "~/breadboard/ClaudeKitBuilder";
import {
	HackerNewsFirebaseKit,
	HackerNewsAlgoliaKit,
	ListKit,
	ObjectKit,
	StringKit,
	JsonKit,
} from "@exadev/breadboard-kits/src";
import board from "../../breadboard/index";

const runner = await BoardRunner.fromGraphDescriptor(board);

new CliAsyncGeneratorRunner(
	(): AsyncGenerator<RunResult, unknown> =>
		runner.run({
			kits: [
				asRuntimeKit(HackerNewsFirebaseKit),
				asRuntimeKit(HackerNewsAlgoliaKit),
				asRuntimeKit(Core),
				asRuntimeKit(ListKit),
				asRuntimeKit(ClaudeKitBuilder),
				asRuntimeKit(ObjectKit),
				asRuntimeKit(JsonKit),
				asRuntimeKit(StringKit),
			],
		}),
	cliRunResultHandler
).run();
