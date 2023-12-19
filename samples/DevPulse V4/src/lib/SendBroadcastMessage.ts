import { addBroadcastListener } from "~/lib/AddBroadcastListener";
import { BroadcastChannelEventHandler } from "~/lib/types.ts";
import { BroadcastMessage } from "~/lib/types.tsx";
import { ResponseForMessage } from "~/lib/types.ts";


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
