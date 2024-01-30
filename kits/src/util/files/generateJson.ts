import { Board } from "@google-labs/breadboard";

export function generateJson(board: Board): string {
	return JSON.stringify(board, null, "\t");
}
export type generateJson = typeof generateJson;
export default generateJson;
