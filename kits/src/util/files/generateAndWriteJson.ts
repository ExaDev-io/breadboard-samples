import BoardMarkdownConfig from "../../types/boardMarkdownConfig.js";
import generateJson from "./generateJson.js";
import writeJson from "./writeJson.js";

export function generateAndWriteJson(
  { dir, filename, board }: BoardMarkdownConfig
) {
  const jsonContent = generateJson(board);
  writeJson({ dir: dir, filename: filename, jsonContent: jsonContent });
}

export type generateAndWriteJson = typeof generateAndWriteJson;
export default generateAndWriteJson;
