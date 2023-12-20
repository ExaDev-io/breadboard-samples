import { BroadcastChannelEventHandler } from "~/lib/types/BroadcastChannelEventHandler.ts";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";


export function addBroadcastListener<T extends BroadcastMessage>(
	channeld: string,
	handler: BroadcastChannelEventHandler<T>,
	messageSource?: T["messageSource"],
	messageTarget?: T["messageTarget"],
	messageType?: T["messageType"]
) {
	const channel = new BroadcastChannel(channeld);

	function intermediateHandler(evt: MessageEvent<T> | Event) {
		console.debug("intermediateHandler", "evt", evt);
		const event = evt as MessageEvent<T>;
		if (!(event && event.data)) {
			console.debug("Skipping empty message");
			return;
		}
		const data: T = event.data;
		console.debug("intermediateHandler", "data", data);
		if (messageSource && data.messageSource !== messageSource) {
			console.debug(`Skipping message from ${data.messageSource}`);
			return;
		}
		if (messageTarget && data.messageTarget !== messageTarget) {
			console.debug(`Skipping message to ${data.messageTarget}`);
			return;
		}
		if (messageType && data.messageType !== messageType) {
			console.debug(`Skipping message of type ${data.messageType}`);
			return;
		}
		console.debug("handling", data);
		handler(event);
		channel.removeEventListener("message", intermediateHandler);
		channel.close();
	}

	channel.addEventListener("message", intermediateHandler);

	return () => {
		channel.removeEventListener("message", intermediateHandler);
		channel.close();
	};
}
