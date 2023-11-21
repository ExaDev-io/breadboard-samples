import { Board } from "@google-labs/breadboard";
import { useEffect, useState } from "react";

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export function TerminalOutput({board}: { board: Board }) {
	const [output, setOutput] = useState<string[]>([]);

	useEffect(() => {
		const processRun = async () => {
			for await (const run of board.run()) {
				if (run.type === "input") {
					if (run.node.id === "claudeApiKey") {
						run.inputs = {CLAUDE_API_KEY};
					}
				} else if (run.type === "output") {
					setOutput((prev) => [
						...prev,
						...JSON.stringify(run.outputs, null, 2).split("\n"),
						"-".repeat(80),
					]);
				}
			}
		};
		processRun();
	}, [board]);

	return (
		<div
			style={{
				backgroundColor: "black",
				color: "lime",
				fontFamily: "monospace",
				padding: "10px",
			}}
		>
			{output.map((item, index) => (
				<pre key={index}>{item}</pre>
			))}
		</div>
	);
}

export default TerminalOutput;
