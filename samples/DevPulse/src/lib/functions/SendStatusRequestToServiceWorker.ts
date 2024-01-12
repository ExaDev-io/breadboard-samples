import { BroadcastChannelEventHandler } from "~/lib/types/BroadcastChannelEventHandler";
import { BroadcastChannelMember } from "~/lib/types/BroadcastChannelMember";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage";

import { sendBroadcastMessageToServiceWorker } from "~/lib/functions/SendBroadcastMessageToServiceWorker";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType";
import { ResponseForMessage } from "~/lib/types/ResponseForMessage";
import { ServiceWorkerStatus } from "~/lib/types/ServiceWorkerStatus";
import { SW_BROADCAST_CHANNEL } from "../constants";

export function sendStatusRequestToServiceWorker<
	M extends BroadcastMessage & {
		messageTarget: BroadcastChannelMember.ServiceWorker;
		messageType: BroadcastMessageType.STATUS;
	} = BroadcastMessage & {
		messageTarget: BroadcastChannelMember.ServiceWorker;
		messageType: BroadcastMessageType.STATUS;
	},
	R extends BroadcastMessage = ResponseForMessage<M> & {
		content: ServiceWorkerStatus;
		source: BroadcastChannelMember.ServiceWorker;
		type: BroadcastMessageType.STATUS;
	},
	H extends BroadcastChannelEventHandler<R> = BroadcastChannelEventHandler<R>
	>({
		channelId = SW_BROADCAST_CHANNEL,
		responseHandler,
	}: {
		channelId?: string;
		responseHandler?: H;
	} = {}) {
	return sendBroadcastMessageToServiceWorker<M, R, H>(
		channelId,
		{
			messageType: BroadcastMessageType.STATUS,
			messageTarget: BroadcastChannelMember.ServiceWorker,
		} as M,
		responseHandler
	);
}
