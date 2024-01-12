import { BroadcastChannelEventHandler } from "~/lib/types/BroadcastChannelEventHandler";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage";
import { ResponseForMessage } from "~/lib/types/ResponseForMessage";
import { addBroadcastListener } from "./AddBroadcastListener";

export function sendBroadcastMessage<
	M extends BroadcastMessage,
	R extends BroadcastMessage = ResponseForMessage<M>,
	H extends BroadcastChannelEventHandler<R> = BroadcastChannelEventHandler<R>
>(channelId: string, message: M, responseHandler?: H) {
	new BroadcastChannel(channelId).postMessage(message);
	if (responseHandler) {
		return addBroadcastListener<R>({
			channelId,
			handler: responseHandler,
			messageSource: message.messageTarget,
			messageTarget: message.messageSource,
			messageType: message.messageType,
		});
	} else {
		return (h: BroadcastChannelEventHandler<R>) =>
			addBroadcastListener<R>({
				channelId,
				handler: h,
				messageSource: message.messageTarget,
				messageTarget: message.messageSource,
				messageType: message.messageType,
			});
	}
}
