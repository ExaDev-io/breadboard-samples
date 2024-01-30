export type MarkdownConfig = {
	mermaidMarkdown: boolean,
	jsonMarkdown: boolean,
	combined: boolean;
};

export enum MarkdownContentType {
	mermaid,
	json,
	typescript
}

export type MarkdownContentList = MarkdownContentType[];

export * as BoardMarkdownConfig from "./boardMarkdownConfig.js";
