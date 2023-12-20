import { addBroadcastListener } from "~/lib/functions/AddBroadcastListener.ts";
import { BroadcastChannelEventHandler } from "~/lib/types/BroadcastChannelEventHandler.ts";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";
import { ResponseForMessage } from "~/lib/types/ResponseForMessage.ts";


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
