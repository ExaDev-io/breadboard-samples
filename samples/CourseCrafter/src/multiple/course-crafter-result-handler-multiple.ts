import { RunResult } from "@google-labs/breadboard";
import * as url from "url";
import path from "path";
import board from "../multiple/index.ts";
import fs from "fs";

const workingDir: string = url.fileURLToPath(new URL(".", import.meta.url));
fs.writeFileSync(
	path.join(workingDir, "board.json"),
	JSON.stringify(board, null, 2)
);

// if we get weird errors, check the blog still exists
const urls = [
	"https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/",
	"https://developer.chrome.com/blog/automatic-picture-in-picture/",
	"https://developer.chrome.com/blog/new-in-webgpu-120/",
];

export async function courseCrafterRunResultHandlerMultiple(
	runResult: RunResult
): Promise<void> {
	if (runResult.type === "input") {
		if (runResult.node.id == "blogDetails") {
			runResult.inputs = {
				list: urls,
			};
		} else if (runResult.node.id == "taskDetails") {
			runResult.inputs = {
				model: "Xenova/distilbart-cnn-6-6",
				task: "summarization",
			};
		} else if (runResult.node.id == "promptDetails") {
			const prompt = [
				"Based these summaries of blog posts:",
				"{{summaries}}",
				"and the original text: ",
				"{{blogContents}}",
				"can you outline topics discussed in each blog? For each blog give me code sample on how to achieve the discussed topic. Output result in markdown format, do not include the summary text in the output. Separate discussed topics in bullet points.",
			].join("/n");

			runResult.inputs = {
				template: prompt,
			};
		}
	} else if (runResult.type === "output") {
		const outputs = runResult.outputs;
		fs.writeFileSync(
			path.join(workingDir, "summary.md"),
			outputs["completion"] as string
		);
	}
}
