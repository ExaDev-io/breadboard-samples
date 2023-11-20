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
	const [inputData, setInputData] = useState({});
	const [outputData, setOutputData] = useState({});
	const [userInput, setUserInput] = useState(""); // State to hold user input

	// Event handler for user input
	const handleInputChange = (event: {
		target: { value: React.SetStateAction<string> };
	}) => {
		setUserInput(event.target.value);
	};

	// Submit handler to initiate processing
	const handleSubmit = async () => {
		for await (const run of board.run({})) {
			if (run.type === "input") {
				// Use the user input data
				run.inputs = {
					...run.inputs,
					inputKey: userInput, // Assuming 'inputKey' is what you need
				};
				setInputData((prev) => ({
					...prev,
					[run.node.id]: {
						node: run.node,
						inputs: run.inputs,
						state: run.state,
					},
				}));
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
			<input type="text" value={userInput} onChange={handleInputChange} />
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
