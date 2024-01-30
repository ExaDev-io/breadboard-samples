import { Board } from "@google-labs/breadboard";
import generateJson from "./generateJson.js";
import generateMermaidMarkdown from "./generateMermaidMarkdown.js";

export function generateCombinedMarkdown(
	{ board, title = board.title }: { board: Board, title?: string; }
) {
	if (!title) {
		throw new Error("Board must have a title or a name must be suplied");
	}

	const markdown = generateMermaidMarkdown(board);
	const json = generateJson(board);
	const jsonCodeBlock = `\`\`\`json\n${json}\n\`\`\``;
	return `# ${title}\n\n${markdown}\n\n${jsonCodeBlock}`;
}
export type generateCombinedMarkdown = typeof generateCombinedMarkdown;
export default generateCombinedMarkdown;
