import { RunResult } from "@google-labs/breadboard";

export async function runResultHandler(runResult: RunResult): Promise<void> {
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
export default runResultHandler;
