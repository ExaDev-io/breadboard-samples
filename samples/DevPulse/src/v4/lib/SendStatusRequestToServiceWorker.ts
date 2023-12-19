import { SW_CONTROL_CHANNEL } from "~/lib/constants";
import { sendBroadcastMessageToServiceWorker } from "./SendBroadcastMessageToServiceWorker";
import { BroadcastChannelEventHandler, BroadcastChannelMember, BroadcastMessage, BroadcastMessageTypes, ResponseForMessage, ServiceWorkerStatus } from "./types";



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
>(channelId: string = SW_CONTROL_CHANNEL, responseHandler?: H) {
	return sendBroadcastMessageToServiceWorker<M, R, H>(
		channelId,
		{
			messageType: BroadcastMessageTypes.STATUS,
			messageTarget: BroadcastChannelMember.ServiceWorker,
		} as M,
		responseHandler
	);
}
