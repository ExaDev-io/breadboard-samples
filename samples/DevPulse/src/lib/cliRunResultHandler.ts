import { RunResult } from "@google-labs/breadboard";
import { getInputAttribute } from "~/lib/getInputAttribute.ts";
import { getInputForSchema } from "~/lib/getInputForSchema.ts";

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
