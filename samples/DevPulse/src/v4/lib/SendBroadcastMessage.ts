import { addBroadcastListener } from "./AddBroadcastListener";
import { BroadcastMessage, ResponseForMessage, BroadcastChannelEventHandler } from "./types";



export function sendBroadcastMessage<
	M extends BroadcastMessage,
	R extends BroadcastMessage = ResponseForMessage<M>,
	H extends BroadcastChannelEventHandler<R> = BroadcastChannelEventHandler<R>
>(channelId: string, message: M, responseHandler?: H) {
	new BroadcastChannel(channelId).postMessage(message);
	if (responseHandler) {
		return addBroadcastListener<R>(
			channelId,
			responseHandler,
			message.messageTarget,
			message.messageSource,
			message.messageType
		);
	} else {
		return (h: BroadcastChannelEventHandler<R>) =>
			addBroadcastListener<R>(
				channelId,
				h,
				message.messageTarget,
				message.messageSource,
				message.messageType
			);
	}
}
