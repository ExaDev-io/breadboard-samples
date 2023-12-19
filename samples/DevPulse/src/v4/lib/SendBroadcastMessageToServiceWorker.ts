import { sendBroadcastMessage } from "./SendBroadcastMessage";
import { BroadcastMessage, BroadcastChannelMember, ResponseForMessage, BroadcastChannelEventHandler } from "./types";



export function sendBroadcastMessageToServiceWorker<
	M extends BroadcastMessage & {
		messageTarget: BroadcastChannelMember.ServiceWorker;
	} = BroadcastMessage & { messageTarget: BroadcastChannelMember.ServiceWorker; },
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
