import { BroadcastChannelEventHandler } from "~/lib/BroadcastChannelEventHandler.ts";
import { BroadcastChannelMember } from "~/lib/BroadcastChannelMember.ts";
import { BroadcastMessage } from "~/lib/BroadcastMessage.tsx";
import { ResponseForMessage } from "~/lib/ResponseForMessage.ts";
import { sendBroadcastMessage } from "~/lib/SendBroadcastMessage.ts";


export function sendBroadcastMessageToServiceWorker<
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
