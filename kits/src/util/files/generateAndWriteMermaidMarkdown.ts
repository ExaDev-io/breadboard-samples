import { BoardMarkdownConfig } from "../../types/boardMarkdownConfig.js";
import generateMermaidMarkdown from "./generateMermaidMarkdown.js";
import writeMarkdown from "./writeMarkdown.js";

export function generateAndWriteMermaidMarkdown(
  {
    dir, filename, board
  }: BoardMarkdownConfig
) {
  writeMarkdown({
    dir,
    filename,
    markdown: generateMermaidMarkdown(
      board,
    )
  });
}
export type generateAndWriteMermaidMarkdown = typeof generateAndWriteMermaidMarkdown;
export default generateAndWriteMermaidMarkdown;
