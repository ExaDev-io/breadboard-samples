import { RunResult } from "@google-labs/breadboard";
import * as url from "url";
import path from "path";
import board from "../single/index.js";
import fs from "fs";

const workingDir: string = url.fileURLToPath(new URL(".", import.meta.url));
fs.writeFileSync(
	path.join(workingDir, "board.json"),
	JSON.stringify(board, null, 2)
);

export async function courseCrafterRunResultHandler(
	runResult: RunResult
): Promise<void> {
	if (runResult.type === "input") {
		if (runResult.node.id == "blogDetails") {
			const blogUrl =
				"https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/";
			runResult.inputs = {
				url: blogUrl,
			};
		} else if (runResult.node.id == "taskDetails") {
			runResult.inputs = {
				model: "Xenova/distilbart-cnn-6-6",
				task: "summarization",
			};
		} else if (runResult.node.id == "promptDetails") {
			const instruction =
				"Based on this summary and original text, give me code sample on how to achieve the discussed topic. Output result in markdown format, do not include the summary text in the output: ";

			runResult.inputs = {
				template: [
					instruction,
					"{{summary}}",
					"the original text is the following: ",
					"{{blogContent}}",
				].join("/n"),
			};
		}
	} else if (runResult.type === "output") {
		const outputs = runResult.outputs;
		console.debug(outputs);
		fs.writeFileSync(
			path.join(workingDir, "summary.md"),
			outputs["completion"] as string
		);
	}
}
