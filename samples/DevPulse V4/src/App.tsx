import { useEffect, useState } from "react";
import "./App.css";
import { BroadcastMessageRenderer } from "./BroadcastMessageRenderer.tsx";
import { ServiceWorkerControllerCommand } from './ServiceWorkerControllerCommand';
import reactLogo from "./assets/react.svg";
import { BroadcastChannelMember } from "./lib/BroadcastChannelMember";
import {
	BroadcastMessage,
	BroadcastMessageTypes,
} from "./lib/BroadcastMessage";
import { SW_BROADCAST_CHANNEL } from "./lib/constants.ts";
import viteLogo from "/vite.svg";

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
			{/* INPUT RENDERER */}
			<BroadcastMessageRenderer channelId={SW_BROADCAST_CHANNEL} />
			<ServiceWorkerControllerComponent />
		</>
	);
}

export default App;

export type ServiceWorkerStatus = {
	active: boolean;
	paused: boolean;
	finished: boolean;
	pendingInputResolvers?: Record<string, unknown>;
};

export function ServiceWorkerControllerComponent({
	channelId = SW_BROADCAST_CHANNEL,
}: {
	channelId?: string;
}): JSX.Element {
	const [currentState, setCurrentState] = useState<ServiceWorkerStatus>();

	type ServiceWorkerStatusResponse = BroadcastMessage & {
		type: BroadcastMessageTypes.STATUS;
		content: ServiceWorkerStatus;
		source: BroadcastChannelMember.ServiceWorker;
	};

	useEffect(() => {
		addBroadcastListener<ServiceWorkerStatusResponse>(
			channelId,
			(evt: MessageEvent<ServiceWorkerStatusResponse>) => {
				setCurrentState(evt.data.content);
			},
			BroadcastChannelMember.ServiceWorker,
			BroadcastChannelMember.Client,
			BroadcastMessageTypes.STATUS
		);
	}, [channelId, currentState]);

	useEffect(() => {
		sendStatusRequestToServiceWorker(undefined, (evt) => {
			setCurrentState(evt.data.content);
		})
	}, []);

	return (
		<div>
			<button
				onClick={() =>
					sendControlCommandToServiceWorker(
						SW_BROADCAST_CHANNEL,
						ServiceWorkerControllerCommand.START,
						(evt): void => {
							setCurrentState(evt.data.content);
						}
					)
				}
			>
				Start
			</button>
			<button
				onClick={() =>
					sendControlCommandToServiceWorker(
						SW_BROADCAST_CHANNEL,
						ServiceWorkerControllerCommand.PAUSE,
						(evt): void => {
							setCurrentState(evt.data.content);
						})
				}
			>
				Pause
			</button>
			<button
				onClick={() =>
					sendControlCommandToServiceWorker(
						SW_BROADCAST_CHANNEL,
						ServiceWorkerControllerCommand.STOP,
						(evt): void => {
							setCurrentState(evt.data.content);
						}
					)
				}
			>
				Stop
			</button>
		</div>
	);
}

interface BroadcastChannelEventHandler<
	M extends BroadcastMessage,
	E = MessageEvent<M>
> {
	(evt: E): void;
}

function addBroadcastListener<T extends BroadcastMessage>(
	channeld: string,
	handler: BroadcastChannelEventHandler<T>,
	source?: T["source"],
	target?: T["target"],
	type?: T["type"]
) {
	const channel = new BroadcastChannel(channeld);
	function intermediateHandler(evt: MessageEvent<T> | Event) {
		if (evt instanceof Event) return;
		const event = evt as MessageEvent<T>;
		if (!(event && event.data)) return;
		const data: T = event.data;
		if (source && data.source !== source) {
			console.debug(`Skipping message from ${data.source}`);
			return;
		}
		if (target && data.target !== target) {
			console.debug(`Skipping message to ${data.target}`);
			return;
		}
		if (type && data.type !== type) {
			console.debug(`Skipping message of type ${data.type}`);
			return;
		}

		handler(event);
	}
	channel.addEventListener("message", intermediateHandler);
	return () => {
		channel.removeEventListener("message", intermediateHandler);
		channel.close();
	};
}

function sendBroadcastMessage<
	M extends BroadcastMessage,
	R extends BroadcastMessage = ResponseForMessage<M>,
	H extends BroadcastChannelEventHandler<R> = BroadcastChannelEventHandler<R>
>(channelId: string, message: M, responseHandler?: H) {
	new BroadcastChannel(channelId).postMessage(message);
	if (responseHandler) {
		return addBroadcastListener<R>(
			channelId,
			responseHandler,
			message.target,
			message.source,
			message.type
		);
	} else {
		return (h: BroadcastChannelEventHandler<R>) =>
			addBroadcastListener<R>(
				channelId,
				h,
				message.target,
				message.source,
				message.type
			);
	}
}

type ResponseForMessage<T extends BroadcastMessage> = {
	id?: T["id"];
	// type?: T["type"];
	target?: T["source"];
	source?: T["target"];
} & BroadcastMessage;

function sendBroadcastMessageToServiceWorker<
	M extends BroadcastMessage & {
		target: BroadcastChannelMember.ServiceWorker;
	} = BroadcastMessage & { target: BroadcastChannelMember.ServiceWorker; },
	R extends BroadcastMessage = ResponseForMessage<M>,
	H extends BroadcastChannelEventHandler<R> = BroadcastChannelEventHandler<R>
>(channelId: string, message: M, responseHandler?: H) {
	return sendBroadcastMessage<M, R, H>(
		channelId,
		{
			...message,
			id: message.id ?? new Date().getTime().toString(),
		},
		responseHandler
	);
}

function sendControlCommandToServiceWorker<
	M extends BroadcastMessage & {
		target: BroadcastChannelMember.ServiceWorker;
		type: BroadcastMessageTypes.COMMAND;
		content: ServiceWorkerControllerCommand;
	},
	R extends BroadcastMessage = ResponseForMessage<M> & {
		content: ServiceWorkerStatus;
		source: BroadcastChannelMember.ServiceWorker;
	},
	H extends BroadcastChannelEventHandler<R> = BroadcastChannelEventHandler<R>
>(channelId: string, command: M["content"], responseHandler?: H) {
	return sendBroadcastMessageToServiceWorker<M, R, H>(
		channelId,
		{
			type: BroadcastMessageTypes.COMMAND,
			content: command,
			target: BroadcastChannelMember.ServiceWorker,
		} as M,
		responseHandler
	);
}

function sendStatusRequestToServiceWorker<
	M extends BroadcastMessage & {
		target: BroadcastChannelMember.ServiceWorker;
		type: BroadcastMessageTypes.STATUS;
	} = BroadcastMessage & {
		target: BroadcastChannelMember.ServiceWorker;
		type: BroadcastMessageTypes.STATUS;
	},
	R extends BroadcastMessage = ResponseForMessage<M> & {
		content: ServiceWorkerStatus;
		source: BroadcastChannelMember.ServiceWorker;
	},
	H extends BroadcastChannelEventHandler<R> = BroadcastChannelEventHandler<R>
>(channelId: string = SW_BROADCAST_CHANNEL, responseHandler?: H) {
	return sendBroadcastMessageToServiceWorker<M, R, H>(
		channelId,
		{
			type: BroadcastMessageTypes.STATUS,
			target: BroadcastChannelMember.ServiceWorker,
		} as M,
		responseHandler
	);
}
