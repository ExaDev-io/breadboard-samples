import { Board } from "@google-labs/breadboard";
import fs from "fs";
import path from "path";
import generateJson from "./generateJson.js";
import generateMermaidMarkdown from "./generateMermaidMarkdown.js";
import { MarkdownContentList, MarkdownContentType } from "../../types/markdown.js";

export const MarkdownContentTypeMap: Map<MarkdownContentType, (board: Board) => string> = new Map([
	[MarkdownContentType.mermaid, generateMermaidMarkdown],
	[MarkdownContentType.json, generateJson],
	[MarkdownContentType.typescript, notImplemented()],
]);

export const HeadingMap: Map<MarkdownContentType, string> = new Map([
	[MarkdownContentType.mermaid, "Mermaid"],
	[MarkdownContentType.json, "JSON"],
	[MarkdownContentType.typescript, "Typescript"],
]);

export const codeBlockMap: Map<MarkdownContentType, string> = new Map([
	[MarkdownContentType.mermaid, "mermaid"],
	[MarkdownContentType.json, "json"],
	[MarkdownContentType.typescript, "typescript"],
]);

export function notImplemented(): (board: Board) => string {
	return () => {
		throw new Error("Not implemented");
	};
}

export function makeMarkdown(
	{
		board,
		title = board.title,
		filename = board.title || title || "README",
		dir = ".",
		markdownConfig
	}: {
		board: Board,
		filename: string,
		title: string,
		dir: string,
		markdownConfig: MarkdownContentList;
	}
) {
	if (!title) {
		throw new Error("Title must either be specified or set in the Board constructor");
	}

	const text: string = markdownConfig.map((markdownContent) => {
		const generateAndWriteMarkdown = MarkdownContentTypeMap.get(markdownContent);
		if (!generateAndWriteMarkdown) {
			throw new Error(`generateAndWriteMarkdowns Error: markdownContent ${markdownContent} not found in MarkdownContentTypeMap`);
		}
		return [
			`## ${HeadingMap.get(markdownContent)}`,
			"```" + codeBlockMap.get(markdownContent),
			generateAndWriteMarkdown(board),
			"```"
		].join("\n");
	}).join("\n\n");
	const titleText = `# ${title}`;

	const combined: string = [
		titleText,
		text,
	].join("\n\n");

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, {
			recursive: true,
		});
	}

	fs.writeFileSync(path.join(dir, `${filename}.md`), combined);
}

export type makeMarkdown = typeof makeMarkdown;
export default makeMarkdown;
