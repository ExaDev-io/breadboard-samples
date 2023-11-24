import { Board } from "@google-labs/breadboard";
import { useEffect, useRef, useState } from "react";
import { cleanString } from "./util/CleanString";
import { ignoredOutputs } from "./util/IgnoredOutputs";

// const worker = new MyWorker();

export function TerminalOutput({board}: { board: Board }) {
	const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

	const [output, setOutput] = useState<string[]>([]);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight;
		}
	}, [output]);

	useEffect(() => {
		const processRun = async () => {
			for await (const run of board.run()) {
				if (run.type === "input") {
					if (run.node.id === "claudeApiKey") {
						run.inputs = {CLAUDE_API_KEY};
					} else if (run.node.id === "searchQuery") {
						run.inputs = {query: "Google Lab"};
					} else if (run.node.id === "searchQueries") {
						run.inputs = {
							queries: [
								"Google Chrome"
							]
						};
					} else {
						console.log("input required for", run.node.id);
					}
				} else if (run.type === "output") {
					const outputMessage = cleanString(run);
					console.log(outputMessage);

					if (ignoredOutputs.includes(run.node.id)) {
						continue;
					}
					setOutput((prev) => [
						...prev,
						outputMessage,
						// ...JSON.stringify(run.outputs, null, 2).split("\n"),
						`\n${"-".repeat(80)}\n`,
					]);
				} else {
					console.debug(run.node.id, run);
				}
			}
		};
		processRun().then(r => console.log("processRun", r));
	}, [CLAUDE_API_KEY, board]);

	return (
		<div
			ref={ref}
			style={{
				// height: '200px',
				// overflowY: 'auto',
				backgroundColor: "black",
				color: "lime",
				fontFamily: "monospace",
				padding: "10px",
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				overflowY: "auto",
			}}
		>
			<pre
				style={{
					margin: 0,
					height: "100%",
					boxSizing: "border-box",
					padding: "10px",
					whiteSpace: "pre-wrap",
					width: "100%",
				}}
			>
				{output.map((item) => item)}
			</pre>
		</div>
	);
}

export default TerminalOutput;
