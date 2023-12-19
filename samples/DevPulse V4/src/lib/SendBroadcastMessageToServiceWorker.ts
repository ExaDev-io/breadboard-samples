import { BroadcastChannelEventHandler } from "~/lib/types.ts";
import { BroadcastChannelMember } from "~/lib/types.ts";
import { BroadcastMessage } from "~/lib/types.tsx";
import { ResponseForMessage } from "~/lib/types.ts";
import { sendBroadcastMessage } from "~/lib/SendBroadcastMessage.ts";


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
