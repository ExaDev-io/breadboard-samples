import React, { useState, useEffect } from 'react';
import {Board} from "@google-labs/breadboard"

const board  = new Board()
const input = board.input()
const output = board.output()
input.wire("*", output)


const MyComponent = () => {
    const [inputData, setInputData] = useState({});
    const [outputData, setOutputData] = useState({});
    const [userInput, setUserInput] = useState(""); // State to hold user input

    // Event handler for user input
    const handleInputChange = (event) => {
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
                setInputData(prev => ({
                    ...prev,
                    [run.node.id]: run.inputs,
                }));
            }
            if (run.type === "output") {
                setOutputData(prev => ({
                    ...prev,
                    [run.node.id]: run.outputs,
                }));
            }
        }
    };

    return (
        <div>
            <input type="text" value={userInput} onChange={handleInputChange} />
            <button onClick={handleSubmit}>Submit</button>
			<div>
				<h3>Input data</h3>
				<pre>{JSON.stringify(inputData, null, 2)}</pre>

				<h3>Output data</h3>

				<pre>{JSON.stringify(outputData, null, 2)}</pre>

				{/* <h3>Board</h3> */}
				{/* <pre>{JSON.stringify(board, null, 2)}</pre> */}

				</div>




        </div>
    );
};

export default MyComponent;
