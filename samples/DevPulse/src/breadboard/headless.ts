#!/usr/bin/env npx -y tsx
// import { generateAndWriteCombinedMarkdown } from "@exadev/breadboard-kits/src/util/files/generateAndWriteCombinedMarkdown.js";
import { BoardRunner } from "@google-labs/breadboard";
import board from "~/breadboard/index";

// generateAndWriteCombinedMarkdown({
// 	board,
// 	filename: "README",
// });

const runner = await BoardRunner.fromGraphDescriptor(await board);


(async () => {
	for await (const runResult of runner.run({
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
