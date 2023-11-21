import "./App.css";
import board from "./hackerNewsBoard.ts";
import { TerminalOutput } from "./TerminalOutput.tsx";

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
console.log("CLAUDE_API_KEY", CLAUDE_API_KEY);

function App() {
	return (
		<>
			<TerminalOutput board={board} />
		</>
	);
}

export default App;
