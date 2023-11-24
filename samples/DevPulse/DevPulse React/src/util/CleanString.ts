import { RunResult } from "@google-labs/breadboard";
import { unescapeHtml } from "./UnescapeHtml.ts";

export function cleanString(run: RunResult): string {
	const outputs = run.outputs;
	const unescapedString = JSON.stringify(outputs, null, 2)
		.replaceAll("\\n", "\n")
		.replaceAll('\\"', '"')
		.replaceAll("\\\\", "\\");
	const unescapedHtml = unescapeHtml(unescapedString);

	return `${run.node.id} ${unescapedHtml}`;
}