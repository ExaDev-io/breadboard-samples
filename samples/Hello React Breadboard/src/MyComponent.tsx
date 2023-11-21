import React, { useState, useEffect } from "react";
import { Board } from "@google-labs/breadboard";

const board = new Board();
const input = board.input();
const output = board.output();
input.wire("foo", output);
const preStyle: React.CSSProperties = {
	textAlign: "left",
	whiteSpace: "pre-wrap",
	wordBreak: "break-word",
};

const MyComponent = () => {
	const [inputData, setInputData] = useState<{ [key: string]: string }>({});
	const [outputData, setOutputData] = useState<{ [key: string]: unknown }>(
		{}
	);
	const [dynamicInputs, setDynamicInputs] = useState<(string | undefined)[]>(
		[]
	);

	// Handle dynamic input change
	const handleDynamicInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		inputKey: string
	) => {
		setInputData((prev) => ({
			...prev,
			[inputKey]: event.target.value,
		}));
	};

	// Submit handler to initiate processing
	const handleSubmit = async () => {
		for await (const run of board.run({})) {
			if (run.type === "input") {
				// Extract newOpportunities
				const newOps = run.state.newOpportunities;
				setDynamicInputs(newOps.map((op) => op.in));

				for (const op of newOps) {
					if (op.in && inputData[op.in]) {
						run.inputs = {
							...run.inputs,
							[op.in]: inputData[op.in],
						};
					}
				}
			}
			if (run.type === "output") {
				setOutputData((prev) => ({
					...prev,
					[run.node.id]: {
						node: run.node,
						outputs: run.outputs,
						state: run.state,
					},
				}));
			}
		}
	};

	return (
		<div>
			{dynamicInputs.map((inputKey) => (
				<input
					key={inputKey}
					type="text"
					value={inputData[inputKey] || ""}
					onChange={(e) => handleDynamicInputChange(e, inputKey)}
					placeholder={`Enter value for ${inputKey}`}
				/>
			))}

			<button onClick={handleSubmit}>Submit</button>

			<h2>Input Nodes</h2>
			<ul>
				{Object.entries(inputData).map(([id, data]) => (
					<li key={id}>
						Input Node ID: {id}
						<pre style={preStyle}>
							{JSON.stringify(data, null, 2)}
						</pre>
					</li>
				))}
			</ul>

			<h2>Output Nodes</h2>
			<ul>
				{Object.entries(outputData).map(([id, data]) => (
					<li key={id}>
						Output Node ID: {id}
						<pre style={preStyle}>
							{JSON.stringify(data, null, 2)}
						</pre>
					</li>
				))}
			</ul>
		</div>
	);
};

export default MyComponent;
