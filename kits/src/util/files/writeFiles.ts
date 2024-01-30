import { Board } from "@google-labs/breadboard";
import generateAndWriteJson from "./generateAndWriteJson.js";
import generateAndWriteMermaidMarkdown from "./generateAndWriteMermaidMarkdown.js";

export function writeFiles(
	board: Board,
	filename = board.title,
	dir = "./output"
) {
	if (!filename) {
		throw new Error("Board must have a title or a filename must be supplied");
	}

	generateAndWriteMermaidMarkdown({ dir, filename, board });
	generateAndWriteJson({ dir, filename, board });
}
export type writeFiles = typeof writeFiles;
export default writeFiles;
