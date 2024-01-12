import { SW_BROADCAST_CHANNEL } from '~/lib/constants';
import { BroadcastChannelEventHandler } from "~/lib/types/BroadcastChannelEventHandler";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage";

export function addBroadcastListener<T extends BroadcastMessage>({
	channelId = SW_BROADCAST_CHANNEL,
	handler,
	messageSource,
	messageTarget,
	messageType,
}: {
	channelId?: string;
	handler: BroadcastChannelEventHandler<T>;
	messageSource?: T["messageSource"];
	messageTarget?: T["messageTarget"];
	messageType?: T["messageType"];
}) {
	const channel = new BroadcastChannel(channelId);

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
			console.debug("messageSource", data.messageSource, "!=", messageSource, "ignoring", data);
			return;
		}
		if (messageTarget && data.messageTarget !== messageTarget) {
			console.debug("messageTarget", data.messageTarget, "!=", messageTarget, "ignoring", data);
			return;
		}
		if (messageType && data.messageType !== messageType) {
			console.debug("messageType", data.messageType, "!=", messageType, "ignoring", data);
			return;
		}
		console.debug("handling", data);
		handler(event);
		channel.close();
	}

	channel.onmessage = intermediateHandler;
}
