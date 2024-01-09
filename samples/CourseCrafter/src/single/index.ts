#!/usr/bin/env npx -y tsx
import { ConfigKit, CourseCrafterKit, StringKit, XenovaKit } from "@exadev/breadboard-kits";

import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { Board } from "@google-labs/breadboard";
import { ClaudeKit } from "@paulkinlan/claude-breadboard-kit";
import fs from "fs";
import path from "path";
import * as url from "url";

const board = new Board({
	title: "CourseCrafter",
});

const courseCraftKit: CourseCrafterKit = board.addKit(CourseCrafterKit);
const xenovaKit: XenovaKit = board.addKit(XenovaKit);
const claudeKit: ClaudeKit = board.addKit(ClaudeKit);
const stringKit: StringKit = board.addKit(StringKit);
const config: ConfigKit = board.addKit(ConfigKit);

const input = board.input({
	$id: "blogDetails",
	schema: {
		type: "object",
		properties: {
			text: {
				type: "string",
				title: "Text",
				description: "urls",
			},
		},
	},
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
	},
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

const getBlogContentForTask = courseCraftKit.getBlogContentForTask({
	$id: "getBlogContents",
});
const pipeline = xenovaKit.pipeline({$id: "summaryLanguageModel"});
const instructionTemplate = stringKit.template({
	$id: "claudePromptConstructor",
});

templateInput.wire("->template", instructionTemplate);
input.wire("->url", getBlogContentForTask);
taskDetails.wire("->model", getBlogContentForTask);
taskDetails.wire("->task", getBlogContentForTask);

// wire blog content into xenova pipeline
getBlogContentForTask.wire("blogContent->input", pipeline);
getBlogContentForTask.wire("model->model", pipeline);
getBlogContentForTask.wire("task->task", pipeline);

getBlogContentForTask.wire("blogContent->blogContent", instructionTemplate);
pipeline.wire("output->summary", instructionTemplate);

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

claudeCompletion.wire("completion->", board.output());

const workingDir: string = url.fileURLToPath(new URL(".", import.meta.url));
generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
	dir: workingDir,
});

const blogUrl =
	"https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/";

fs.writeFileSync(path.join(workingDir, "board.json"), JSON.stringify(board, null, "\t"));

for await (const runResult of board.run({})) {
	if (runResult.type === "input") {
		if (runResult.node.id == "blogDetails") {
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
		fs.writeFileSync(
			path.join(
				workingDir,
				"summary.md"
			),
			outputs["completion"] as string
		);
	}
}
