import { pendingInputResolvers } from "../../lib/sw/pendingInputResolvers.ts";

export function waitForInput(node: string, attrib: string): Promise<string> {
	return new Promise<string>((resolve) => {
		pendingInputResolvers[`${node}-${attrib}`] = resolve;
	});
}
