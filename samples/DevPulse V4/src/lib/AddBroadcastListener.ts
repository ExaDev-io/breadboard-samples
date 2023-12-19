import { BroadcastChannelEventHandler } from "~/lib/BroadcastChannelEventHandler.ts";
import { BroadcastMessage } from "~/lib/BroadcastMessage.tsx";


export function addBroadcastListener<T extends BroadcastMessage>(
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
