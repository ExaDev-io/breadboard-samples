import viteLogo from "/vite.svg";
import reactLogo from "~/assets/react.svg";
import { useState } from 'react';
import "~/components/App.css";
import { BroadcastMessageRenderer } from "~/components/BroadcastMessageRenderer.tsx";
import { SW_BROADCAST_CHANNEL } from "~/lib/constants/SW_BROADCAST_CHANNEL.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { InputRequestsRenderer } from "~/components/InputRequestsRenderer.tsx";
import { ServiceWorkerControllerComponent } from "~/components/ServiceWorkerControllerComponent.tsx";

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
			<InputRequestsRenderer channelId={SW_BROADCAST_CHANNEL} />
			<ServiceWorkerControllerComponent />
			<BroadcastMessageRenderer
				channelId={SW_BROADCAST_CHANNEL}
				ignoreMatchers={[
					(message) => message.messageType != BroadcastMessageType.OUTPUT,
				]}
			/>
		</>
	);
}

export default App;
