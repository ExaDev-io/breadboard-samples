#!/usr/bin/env npx -y tsx
import { generateAndWriteCombinedMarkdown } from "@exadev/breadboard-kits/src/util/files/generateAndWriteCombinedMarkdown.js";
import board from "~/breadboard/index";

generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
});

(async () => {
	for await (const runResult of board.run({
		// probe: new LogProbe()
	})) {
		if (!process.env.CLAUDE_API_KEY) {
			throw new Error("Missing CLAUDE_API_KEY");
		}

		if (runResult.type === "input") {
			runResult.inputs = {
				"query": "Post Office Horizon",
				"limit": 2,
				"claudeApiKey": process.env.CLAUDE_API_KEY
			};
		} else if (runResult.type === "output") {
			console.log(runResult.node.id, runResult.outputs);
		}
	}
})();
