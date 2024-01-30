import BoardMarkdownConfig from "../../types/boardMarkdownConfig.js";
import generateCombinedMarkdown from "./generateCombinedMarkdown.js";
import writeCombinedMarkdown from "./writeCombinedMarkdown.js";

export function generateAndWriteCombinedMarkdown(
	{ board, filename, title, dir }: BoardMarkdownConfig
) {
	if (!filename) {
		throw new Error("Board must have a title or a name must be suplied");
	}

	const markdown = generateCombinedMarkdown({ board, title });
	writeCombinedMarkdown({ dir, filename, markdown });
}

export type generateAndWriteCombinedMarkdown = typeof generateAndWriteCombinedMarkdown;
export default generateAndWriteCombinedMarkdown;
