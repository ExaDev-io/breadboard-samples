import { Board } from "@google-labs/breadboard";

export function generateMermaidMarkdown(board: Board): string {
	return ["```mermaid", board.mermaid(), "```"].join("\n");
}

export type generateMermaidMarkdown = typeof generateMermaidMarkdown;
export default generateMermaidMarkdown;
