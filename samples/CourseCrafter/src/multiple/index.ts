#!/usr/bin/env npx -y tsx
import { ClaudeKit, ConfigKit, CourseCrafterKit, StringKit, XenovaKit } from "@exadev/breadboard-kits/src/index.js";
import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/src/util/files/generateAndWriteCombinedMarkdown.js";
import { Board, BreadboardNode, InputValues, OutputValues, Schema } from "@google-labs/breadboard";
import fs from "fs";
import path from "path";
import * as url from 'url';

const board: Board = new Board({
	title: "CourseCrafter Multiple",
});

const courseCraftKit = board.addKit(CourseCrafterKit);
const xenovaKit = board.addKit(XenovaKit);
const claudeKit: ClaudeKit = board.addKit(ClaudeKit);
const stringKit: StringKit = board.addKit(StringKit);
const config: ConfigKit = board.addKit(ConfigKit);

const blogDetails = board.input({
	$id: "blogDetails",
	schema: {
		type: "object",
		properties: {
			text: {
				type: "list",
				title: "Text",
				description: "urls",
			},
		},
	} satisfies Schema,
});

const templateInput = board.input({
	$id: "promptDetails",
	schema: {
		type: "object",
		properties: {
			text: {
				type: "string",
				title: "Text",
				description: "urls",
			},
		},
	} satisfies Schema,
});

const taskDetails = board.input({
	$id: "taskDetails",
	schema: {
		type: "object",
		properties: {
			text: {
				type: "string",
				title: "Text",
				description: "model and task",
			},
		},
	},
});

const getContent = courseCraftKit.getBlogsContent({ $id: "getBlogsContent" });
const pipeline = xenovaKit.pipelineBulk({ $id: "summaryLanguageModel" });
const instructionTemplate = stringKit.template({ $id: "claudePromptConstructor" });

templateInput.wire("->template", instructionTemplate);
blogDetails.wire("->list", getContent);
taskDetails.wire("->model", pipeline);
taskDetails.wire("->task", pipeline);

// wire blog content into xenova pipeline
getContent.wire("blogOutput->inputs", pipeline);

getContent.wire("blogOutput->blogContents", instructionTemplate);
pipeline.wire("summaries->summaries", instructionTemplate);

const serverUrl = "https://api.anthropic.com/v1/complete";

const claudeParams = {
	model: "claude-2",
	url: `${serverUrl}`,
};

const claudeCompletion = claudeKit.generateCompletion({
	$id: "claudeAPI",
	...claudeParams,
});

const claudeApiKey = config.readEnvVar({
	key: "CLAUDE_API_KEY",
});

claudeApiKey.wire("CLAUDE_API_KEY", claudeCompletion);
instructionTemplate.wire("string->text", claudeCompletion);

const output: BreadboardNode<InputValues, OutputValues> = board.output();
claudeCompletion.wire("completion->", output);
const workingDir: string = url.fileURLToPath(new URL(".", import.meta.url));

generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
	dir: workingDir
});

// if we get weird errors, check the blog still exists
const urls = [
	"https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/",
	"https://developer.chrome.com/blog/automatic-picture-in-picture/",
	"https://developer.chrome.com/blog/new-in-webgpu-120/"
];

fs.writeFileSync(path.join(workingDir, "board.json"), JSON.stringify(board, null, "\t"));


for await (const runResult of board.run()) {
	if (runResult.type === "input") {
		if (runResult.node.id == "blogDetails") {
			runResult.inputs = {
				list: urls
			};
		} else if (runResult.node.id == "taskDetails") {
			runResult.inputs = {
				model: "Xenova/distilbart-cnn-6-6",
				task: "summarization"
			};
		} else if (runResult.node.id == "promptDetails") {
			const prompt = ["Based these summaries of blog posts:", "{{summaries}}", "and the original text: ", "{{blogContents}}", "can you outline topics discussed in each blog? For each blog give me code sample on how to achieve the discussed topic. Output result in markdown format, do not include the summary text in the output. Separate discussed topics in bullet points."].join("/n");

			runResult.inputs = {
				template: prompt,
			};
		}
	} else if (runResult.type === "output") {
		const outputs = runResult.outputs;
		fs.writeFileSync(
			path.join(
				workingDir,
				"summary.md"
			),
			outputs["completion"] as string
		);
	}
}
