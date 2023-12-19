import { useState } from "react";
import "./App.css";
import { BroadcastMessageRenderer } from "./BroadcastMessageRenderer.tsx";
import { SW_BROADCAST_CHANNEL } from "./lib/constants.ts";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function sendCommandToSW(command: string) {
	// if (navigator.serviceWorker.controller) {
	// 	navigator.serviceWorker.controller.postMessage({ command });
	// 	console.log(`"${command}" -> SW`);
	// } else {
	// 	console.error('ServiceWorker not registered');
	// }
	new BroadcastChannel(SW_BROADCAST_CHANNEL).postMessage({ command });
}

function App() {
	const [count, setCount] = useState(0);
	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
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
      <BroadcastMessageRenderer channelId={SW_BROADCAST_CHANNEL} />
			<div style={{ display: "flex", justifyContent: "space-evenly" }}>
				<button onClick={() => sendCommandToSW("start")}>Start</button>
				<button onClick={() => sendCommandToSW("pause")}>Pause</button>
				<button onClick={() => sendCommandToSW("stop")}>Stop</button>
			</div>
		</>
	);
}

export default App;
