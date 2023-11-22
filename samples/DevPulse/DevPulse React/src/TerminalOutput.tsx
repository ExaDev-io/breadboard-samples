import { Board } from "@google-labs/breadboard";
import { useEffect, useRef, useState } from "react";

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

function unescapeHtml(str: string): string {
	return str.replace(/&(#?\w+);/g, (_match, p1) => {
		const charCode = p1.startsWith("#") ? parseInt(p1.slice(1), 16) : decodeURI(p1);
		return String.fromCharCode(typeof charCode === "number" ? charCode : 0);
	});
}

function cleanString(run: any): string {
	const outputs = run.outputs
	const unescapedString = JSON.stringify(outputs, null, 2)
		.replaceAll("\\n", "\n")
		.replaceAll("\\\"", "\"")
		.replaceAll("\\\\", "\\")
	const unescapedHtml = unescapeHtml(unescapedString)

	return `${run.node.id} ${unescapedHtml}`;
}

const ignoredOutputs = [
	"fullCommentData",
	"commentOutput",
	"truncatePost",
]

export function TerminalOutput({board}: { board: Board }) {
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
					}
				} else if (run.type === "output") {
					if (ignoredOutputs.includes(run.node.id)) {
						continue;
					}
					const outputMessage = cleanString(run);
					console.log(outputMessage)
					setOutput((prev) => [
						...prev,
						outputMessage,
						// ...JSON.stringify(run.outputs, null, 2).split("\n"),
						`\n${"-".repeat(80)}\n`,
					]);
				}
			}
		};
		processRun().then(r => console.log("processRun", r));
	}, [board]);

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
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				overflowY: 'auto',
			}}
		>
			<pre
				style={{
					margin: 0,
					height: '100%',
					boxSizing: 'border-box',
					padding: '10px',
					whiteSpace: 'pre-wrap',
					width: '100%',
				}}
			>
			{output.map((item) => item)}
			</pre>
		</div>
	);
}

export default TerminalOutput;
