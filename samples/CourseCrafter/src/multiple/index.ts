#!/usr/bin/env npx -y tsx
import {
	ClaudeKit,
	ConfigKit,
	CourseCrafterKit,
	StringKit,
	XenovaKit,
} from "@exadev/breadboard-kits/src/index.js";
import { addKit, Schema, board, base } from "@google-labs/breadboard";

//////////////////////////////////////////////
const courseCraftKit = addKit(CourseCrafterKit);
const xenovaKit = addKit(XenovaKit);
const claudeKit = addKit(ClaudeKit);
const stringKit = addKit(StringKit);
const config = addKit(ConfigKit);
//////////////////////////////////////////////
const blogDetailsSchema = {
	type: "object",
	properties: {
		text: {
			type: "list",
			title: "Text",
			description: "urls",
		},
	},
} satisfies Schema;

const templateInputSchema = {
	type: "object",
	properties: {
		text: {
			type: "string",
			title: "Text",
			description: "urls",
		},
	},
} satisfies Schema;

const taskDetailsSchema = {
	type: "object",
	properties: {
		text: {
			type: "string",
			title: "Text",
			description: "model and task",
		},
	},
} satisfies Schema;
//////////////////////////////////////////////
const courseCrafterBoardMultiple = board(() => {
	const blogDetails = base.input({
		$id: "blogDetails",
		schema: blogDetailsSchema,
	});

	const templateInput = base.input({
		$id: "promptDetails",
		schema: templateInputSchema,
	});

	const taskDetails = base.input({
		$id: "taskDetails",
		schema: taskDetailsSchema,
	});

	const getContent = courseCraftKit.getBlogsContent({ $id: "getBlogsContent" });
	const pipeline = xenovaKit.pipelineBulk({ $id: "summaryLanguageModel" });
	const instructionTemplate = stringKit.template({
		$id: "claudePromptConstructor",
	});

	templateInput.template.to(instructionTemplate);
	blogDetails.list.to(getContent);
	taskDetails.model.to(getContent);
	taskDetails.task.to(getContent);

	// wire blog content into xenova pipeline
	getContent.blogContent.as("inputs").to(pipeline);

	getContent.blogOutput.as("blogContents").to(instructionTemplate);
	pipeline.summaries.to(instructionTemplate);

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

	claudeApiKey.apiKey.to(claudeCompletion);
	instructionTemplate.string.as("text").to(claudeCompletion);

	const output = base.output({ $id: "output-2" });
	claudeCompletion.completion.as("completion").to(output);
	return output;
});

const serializedCourseCrafterBoardMultiple =
	await courseCrafterBoardMultiple.serialize({
		title: "CourseCrafter Multiple",
		description: "CourseCrafter for a multiple URL.",
	});

export { serializedCourseCrafterBoardMultiple as board };
export { serializedCourseCrafterBoardMultiple as default };
