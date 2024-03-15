#!/usr/bin/env npx -y tsx

import {
	ClaudeKit,
	ConfigKit,
	CourseCrafterKit,
	StringKit,
	XenovaKit,
} from "@exadev/breadboard-kits/src";
import { addKit, Schema, board, base } from "@google-labs/breadboard";

//////////////////////////////////////////////
const courseCraftKit = addKit(CourseCrafterKit);
const xenovaKit = addKit(XenovaKit);
const claudeKit = addKit(ClaudeKit);
const stringKit = addKit(StringKit);
const config = addKit(ConfigKit);
//////////////////////////////////////////////
const url: Schema = {
	type: "object",
	properties: {
		url: {
			type: "string",
			title: "Text",
			description: "urls",
		},
	},
};
const template: Schema = {
	type: "object",
	properties: {
		template: {
			type: "string",
			title: "Text",
			description: "urls",
		},
	},
};
const taskDetails: Schema = {
	type: "object",
	properties: {
		model: {
			type: "string",
			title: "Text",
			description: "model",
		},
		task: {
			type: "string",
			title: "Text",
			description: "task",
		},
	},
};
//////////////////////////////////////////////
const courseCrafterBoard = board(() => {
	const getBlogContentForTask = courseCraftKit.getBlogContentForTask({
		$id: "getBlogContents",
	});
	const pipeline = xenovaKit.pipeline({ $id: "summaryLanguageModel" });
	const instructionTemplate = stringKit.template({
		$id: "claudePromptConstructor",
	});

	const urlInput = base.input({ $id: "blogDetails", schema: url });
	const taskDetailsInput = base.input({
		$id: "taskDetails",
		schema: taskDetails,
	});
	taskDetailsInput.model.to(pipeline);
	taskDetailsInput.task.to(pipeline);
	const templateInput = base.input({ $id: "promptDetails", schema: template });

	urlInput.url.to(getBlogContentForTask);
	templateInput.template.to(instructionTemplate);
	taskDetailsInput.model.to(getBlogContentForTask);
	taskDetailsInput.task.to(getBlogContentForTask);

	// wire blog content into xenova pipeline
	getBlogContentForTask.blogContent.as("input").to(pipeline);

	getBlogContentForTask.blogContent.to(instructionTemplate);
	pipeline.output.as("summary").to(instructionTemplate);

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

const serializedCourseCrafterBoard = await courseCrafterBoard.serialize({
	title: "CourseCrafter Single",
	description: "CourseCrafter for a single URL.",
});

export { serializedCourseCrafterBoard as board };
export { serializedCourseCrafterBoard as default };
