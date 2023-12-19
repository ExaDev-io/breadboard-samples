import { BroadcastChannelEventHandler } from "~/lib/types.ts";
import { BroadcastChannelMember } from "~/lib/types.ts";
import { BroadcastMessage, BroadcastMessageTypes } from "~/lib/types.ts";
import { SW_BROADCAST_CHANNEL } from "~/lib/constants.ts";
import { ResponseForMessage } from "~/lib/types.ts";
import { sendBroadcastMessageToServiceWorker } from "~/lib/SendBroadcastMessageToServiceWorker.ts";
import { ServiceWorkerStatus } from "~/lib/types.ts";


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
