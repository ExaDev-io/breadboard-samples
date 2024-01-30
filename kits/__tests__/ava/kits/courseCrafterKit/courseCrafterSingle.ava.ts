import { Board } from "@google-labs/breadboard";
import Core from "@google-labs/core-kit";
import { Starter } from "@google-labs/llm-starter";
import test from "ava";
import { config } from "dotenv";
import fs from "fs";
import { ClaudeKit } from "../../../../src/kits/ClaudeKit.js";
import { StringKit } from "../../../../src/kits/StringKit.js";
import XenovaKit from "../../../../src/kits/XenovaKit.js";
import CourseCrafterKit from "../../../../src/kits/courseCrafter/CourseCrafterKit.js";
import { MarkdownContentType } from "../../../../src/types/markdown.js";
import makeMarkdown from "../../../../src/util/files/makeMarkdown.js";

const TIMEOUT = 200_000;
// single blog post
// purposely removed .ava so it doesn't run with github pipeline, because this wont work without the api key in .env
test("courseCrafterKit.Xenova.Claude", async (t) => {
	t.timeout(TIMEOUT);
	const board = new Board({
		title: "Course Crafter Kit",
		description: "Course Crafter Kit Test with Xenova",
		version: "0.0.1",
	});

	const courseCraftKit: CourseCrafterKit = board.addKit(CourseCrafterKit);
	const xenovaKit: XenovaKit = board.addKit(XenovaKit);
	const claudeKit: ClaudeKit = board.addKit(ClaudeKit);
	const stringKit: StringKit = board.addKit(StringKit);
	const core = board.addKit(Core);
	const starter = board.addKit(Starter);
	config();

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
	const pipeline = xenovaKit.pipeline({ $id: "summaryLanguageModel" });
	const output = board.output({ $id: "outputSummary" });

	const instruction =
		"Based on this summary and original text, give me code sample on how to achieve the discussed topic. Output result in markdown format, do not include the summary text in the output: ";
	const instructionTemplate: StringKit = stringKit.template({
		$id: "claudePromptConstructor",
		template: [
			instruction,
			"{{summary}}",
			"the original text is the following: ",
			"{{blogContent}}",
		].join("/n"),
	});

	templateInput.wire("->template", instructionTemplate);
	input.wire("->url", getBlogContentForTask);
	taskDetails.wire("->model", getBlogContentForTask);
	taskDetails.wire("->task", getBlogContentForTask);

	// wire blog content into xenova pipeline
	getBlogContentForTask.wire("blogContent->input", pipeline);
	getBlogContentForTask.wire("model->model", pipeline);
	getBlogContentForTask.wire("task->task", pipeline);
	// use passthrough to collect all outputs of previous nodes/kits
	const allOutputs = core.passthrough({ $id: "outputCollector" });

	getBlogContentForTask.wire("blogContent->blogContent", instructionTemplate);
	pipeline.wire("output->summary", instructionTemplate);
	getBlogContentForTask.wire("blogContent->blogContent", allOutputs);
	pipeline.wire("output->blogSummary", allOutputs);

	const secrets = starter.secrets({ keys: ["CLAUDE_KEY"] });
	const serverUrl = "https://api.anthropic.com/v1/complete";
	const claudeParams = {
		model: "claude-2",
		url: `${serverUrl}`,
	};

	const claudeCompletion = claudeKit.complete({
		$id: "claudeAPI",
		...claudeParams,
	});

	secrets.wire("CLAUDE_KEY->apiKey", claudeCompletion);
	instructionTemplate.wire("string->userQuestion", claudeCompletion);
	instructionTemplate.wire("string->userQuestion", allOutputs);
	claudeCompletion.wire("completion->claudeResponse", allOutputs);
	allOutputs.wire("*", output);

	makeMarkdown({
		board,
		filename: board.title!,
		title: board.title!,
		dir: "./tests/kits/courseCrafterKit",
		markdownConfig: [MarkdownContentType.mermaid, MarkdownContentType.json],
	});

	const blogURL =
		"https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/";
	const result = await board.runOnce({
		url: blogURL,
		model: "Xenova/distilbart-cnn-6-6",
		task: "summarization",
	});

	const outputBuffer = [];
	outputBuffer.push({ url: blogURL, ...result });
	// write all outputs into 1 file, summarising the whole process
	fs.writeFileSync(
		"./tests/kits/courseCrafterKit/blog_summary.json",
		JSON.stringify(outputBuffer, null, 2)
	);
	// this prompt returns text in markdown format
	fs.writeFileSync(
		"./tests/kits/courseCrafterKit/code.md",
		result.claudeResponse.toString()
	);

	t.is(true, true);
});
