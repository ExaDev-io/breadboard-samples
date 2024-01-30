import { Board } from "@google-labs/breadboard";

export type BoardMarkdownConfig = {
	dir?: string,
	filename: string,
	board: Board;
	title?: string;
};

export default BoardMarkdownConfig;
