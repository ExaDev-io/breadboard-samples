import { BroadcastChannelEventHandler } from "~/lib/BroadcastChannelEventHandler.ts";
import { BroadcastChannelMember } from "~/lib/BroadcastChannelMember.ts";
import { BroadcastMessage, BroadcastMessageTypes } from "~/lib/BroadcastMessage.tsx";
import { SW_BROADCAST_CHANNEL } from "~/lib/constants.ts";
import { ResponseForMessage } from "~/lib/ResponseForMessage.ts";
import { sendBroadcastMessageToServiceWorker } from "~/lib/SendBroadcastMessageToServiceWorker.ts";
import { ServiceWorkerStatus } from "~/lib/ServiceWorkerStatus.ts";


export function sendStatusRequestToServiceWorker<
	M extends BroadcastMessage & {
		messageTarget: BroadcastChannelMember.ServiceWorker;
		messageType: BroadcastMessageTypes.STATUS;
	} = BroadcastMessage & {
		messageTarget: BroadcastChannelMember.ServiceWorker;
		messageType: BroadcastMessageTypes.STATUS;
	},
	R extends BroadcastMessage = ResponseForMessage<M> & {
		content: ServiceWorkerStatus;
		source: BroadcastChannelMember.ServiceWorker;
		type: BroadcastMessageTypes.STATUS;
	},
	H extends BroadcastChannelEventHandler<R> = BroadcastChannelEventHandler<R>
>(channelId: string = SW_BROADCAST_CHANNEL, responseHandler?: H) {
	return sendBroadcastMessageToServiceWorker<M, R, H>(
		channelId,
		{
			messageType: BroadcastMessageTypes.STATUS,
			messageTarget: BroadcastChannelMember.ServiceWorker,
		} as M,
		responseHandler
	);
}
