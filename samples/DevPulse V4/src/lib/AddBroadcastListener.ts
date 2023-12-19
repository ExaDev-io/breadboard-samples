import { BroadcastChannelEventHandler } from "~/lib/BroadcastChannelEventHandler.ts";
import { BroadcastMessage } from "~/lib/BroadcastMessage.tsx";


export function addBroadcastListener<T extends BroadcastMessage>(
	channeld: string,
	handler: BroadcastChannelEventHandler<T>,
	source?: T["messageSource"],
	target?: T["messageTarget"],
	type?: T["messageType"]
) {
	const channel = new BroadcastChannel(channeld);

	function intermediateHandler(evt: MessageEvent<T> | Event) {
		if (evt instanceof Event) return;
		const event = evt as MessageEvent<T>;
		if (!(event && event.data)) return;
		const data: T = event.data;
		if (source && data.messageSource !== source) {
			console.debug(`Skipping message from ${data.messageSource}`);
			return;
		}
		if (target && data.messageTarget !== target) {
			console.debug(`Skipping message to ${data.messageTarget}`);
			return;
		}
		if (type && data.messageType !== type) {
			console.debug(`Skipping message of type ${data.messageType}`);
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
