import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
console.log("CLAUDE_API_KEY", CLAUDE_API_KEY);

const board = import("./hackerNewsBoard.ts").then((m) => m.makeBoard());

board.then(async (board) => {
	for await (const run of board.run()) {
		console.log("run.node.id", run.node.id);
		if (run.type === "input") {
			if (run.node.id === "claudeApiKey") {
				run.inputs = {
					CLAUDE_API_KEY,
				};
			}

			// const opId = run.state.opportunities[0].in;
			// run.inputs = {
			// 	[opId ?? "message"]: new Date().toISOString(),
			// };
		} else if (run.type === "output") {
			console.log(run.node.id, run.outputs);
		} else {
			// console.log(run.node.id, run.state);
		}
	}
});

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img
						src={reactLogo}
						className="logo react"
						alt="React logo"
					/>
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
