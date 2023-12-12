#!/usr/bin/env tsx
import { Board, RunResult, Schema } from "@google-labs/breadboard";
import board from "../breadboard/index";
import * as readline from "readline";
import { basename } from "path/posix";
import { generateAndWriteCombinedMarkdown } from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";

// for await (const runResult of board.run()) {}

// let runResult = await boardRun.next();
// while (!runResult.done) {
// 	await runResultHandler(runResult.value);
// 	runResult = await boardRun.next();
// }

export class CliAsyncGeneratorRunner<
	TReturn,
	TNext,
	TNextReturn,
	TGenerateParams
> {
	constructor(
		private readonly generatorGenerator: (
			params?: TGenerateParams
		) => AsyncGenerator<TReturn, TNext, TNextReturn | undefined>,
		private readonly handler: (value: TReturn) => unknown,
		private readonly generatorParams?: TGenerateParams
	) {}
	run(): void {
		const generator = this.generatorGenerator(this.generatorParams);
		const handler = this.handler;
		(async (): Promise<void> => {
			try {
				for await (const value of generator) {
					await handler(value);
				}
			} catch (error) {
				console.error(error);
			}
		})();
	}
}

function getInputAttribute(runResult: RunResult): Schema {
	let schema: Schema;
	const inputAttribute: string = runResult.state.newOpportunities.find(
		(op) => op.from == runResult.node.id
	)!.out!;

	const schemaFromOpportunity = {
		type: "object",
		properties: {
			[inputAttribute]: {
				title: inputAttribute,
				type: "string",
			},
		},
	};

	if (runResult.inputArguments.schema) {
		schema = runResult.inputArguments.schema as Schema;
		if (!Object.keys(schema.properties!).includes(inputAttribute)) {
			throw new Error(
				`Input attribute "${inputAttribute}" not found in schema:\n${JSON.stringify(
					schema,
					null,
					2
				)}`
			);
		}
	} else {
		schema = schemaFromOpportunity;
	}
	return schema;
}

function getInputForSchema(schema: Schema): Promise<{ [key: string]: string }> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const askQuestion = (query: string): Promise<string> => {
		return new Promise((resolve) => rl.question(query, resolve));
	};

	async function getInputFromSchema() {
		const userInput: { [key: string]: string } = {};

		for (const key in schema.properties) {
			const property = schema.properties[key];
			if (property.type === "string") {
				const answer = await askQuestion(`${property.title}: `);
				userInput[key] = answer;
			}
		}

		rl.close();
		return userInput;
	}

	return getInputFromSchema();
}

export async function cliRunResultHandler(runResult: RunResult): Promise<void> {
	console.debug("=".repeat(80));
	console.debug(runResult.node.id, runResult.type);
	if (runResult.type === "input") {
		const inputAttribute = getInputAttribute(runResult);
		const input = await getInputForSchema(inputAttribute);
		console.debug(runResult.node.id, "input", input);
		runResult.inputs = input;
		return;
	} else if (runResult.type === "output") {
		console.debug(runResult.node.id, "output", runResult.outputs);
		return;
	}
}

generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
});

const boardRunner: CliAsyncGeneratorRunner<
	RunResult,
	unknown,
	unknown,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any
> = new CliAsyncGeneratorRunner(
	(): AsyncGenerator<RunResult, unknown, unknown> => board.run(),
	cliRunResultHandler
);

boardRunner.run();
