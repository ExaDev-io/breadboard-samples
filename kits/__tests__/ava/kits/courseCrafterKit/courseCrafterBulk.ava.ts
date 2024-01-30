import { Board } from "@google-labs/breadboard";
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
// Bulk blog posts
// purposely removed .ava so it doesn't run with github pipeline, because this wont work without the api key in .env
test("courseCrafterKit.getContent.Bulk", async (t) => {
	t.timeout(TIMEOUT);
	const board = new Board({
		title: "Course Crafter Kit Bulk Blogs Test",
		description: "Course Crafter Kit Bulk Blogs Testt",
		version: "0.0.1",
	});

	const courseCraftKit = board.addKit(CourseCrafterKit);
	const xenovaKit = board.addKit(XenovaKit);
	const claudeKit = board.addKit(ClaudeKit);
	const stringKit = board.addKit(StringKit);
	const starter = board.addKit(Starter);
	config();

	const input = board.input({
		$id: "blogUrls",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "list",
					title: "Text",
					description: "urls",
				},
			},
		},
	});

	const input2 = board.input({
		$id: "taskDetails",
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

	const getContent = courseCraftKit.getBlogsContent({
		$id: "getBlogsContent",
	});
	const output = board.output({ $id: "outputSummary" });
	const pipeline = xenovaKit.pipelineBulk({ $id: "summaryLanguageModel" });

	const blogURL =
		"https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/";
	const blogURL2 =
		"https://developer.chrome.com/blog/automatic-picture-in-picture/";
	const blogURL3 =
		"https://developer.chrome.com/blog/third-party-cookie-deprecation-trial/";
	const urls = [blogURL, blogURL2, blogURL3];

	input.wire("->list", getContent);
	input2.wire("model->", pipeline);
	input2.wire("task->", pipeline);
	getContent.wire("blogOutput->inputs", pipeline);
	pipeline.wire("*", output);
	// construct a promp for claude
	const prompt = [
		"Based these summaries of blog posts:",
		"{{summaries}}",
		"and the original text: ",
		"{{blogContents}}",
		"can you outline topics discussed in each blog? For each blog give me code sample on how to achieve the discussed topic. Output result in markdown format, do not include the summary text in the output. Separate discussed topics in bullet points.",
	].join("/n");
	const instructionTemplate = stringKit.template({
		$id: "claudePromptConstructor",
		template: prompt,
	});

	templateInput.wire("->template", instructionTemplate);
	getContent.wire("blogOutput->blogContents", instructionTemplate);
	pipeline.wire("summaries->summaries", instructionTemplate);

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
	claudeCompletion.wire("completion->", output);

	const result = await board.runOnce({
		list: urls,
		model: "Xenova/distilbart-cnn-6-6",
		task: "summarization",
	});

	const outputBuffer = [];
	outputBuffer.push({
		urls: urls,
		summaries: result["summaries"],
		prompt: prompt,
		claude_response: result["completion"],
	});
	// output results, produce mermaid diagram
	fs.writeFileSync(
		"./tests/kits/courseCrafterKit/blog_bulk.json",
		JSON.stringify(outputBuffer, null, 2)
	);
	fs.writeFileSync(
		"./tests/kits/courseCrafterKit/bulk_code.md",
		result.completion.toString()
	);

	makeMarkdown({
		board,
		filename: board.title,
		title: board.title,
		dir: "./tests/kits/courseCrafterKit",
		markdownConfig: [MarkdownContentType.mermaid, MarkdownContentType.json],
	});

	t.is(true, true);
});
