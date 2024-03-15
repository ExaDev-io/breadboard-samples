import {
	ClaudeKit,
	ConfigKit,
	CourseCrafterKit,
	StringKit,
	XenovaKit,
} from "@exadev/breadboard-kits/src";
import { BoardRunner, RunResult, asRuntimeKit } from "@google-labs/breadboard";
import { CliAsyncGeneratorRunner } from "~/breadboard/cli-async-generator-runner.js";
import board from "../single/index.js";
import { courseCrafterRunResultHandler } from "./course-crafter-result-handler.js";

const runner = await BoardRunner.fromGraphDescriptor(board);

new CliAsyncGeneratorRunner(
	(): AsyncGenerator<RunResult, unknown> =>
		runner.run({
			kits: [
				asRuntimeKit(CourseCrafterKit),
				asRuntimeKit(XenovaKit),
				asRuntimeKit(ClaudeKit),
				asRuntimeKit(StringKit),
				asRuntimeKit(ConfigKit),
			],
		}),
	courseCrafterRunResultHandler
).run();
