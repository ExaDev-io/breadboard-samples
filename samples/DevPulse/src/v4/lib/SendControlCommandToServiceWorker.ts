import { sendBroadcastMessageToServiceWorker } from "./SendBroadcastMessageToServiceWorker";
import { BroadcastMessage, BroadcastChannelMember, BroadcastMessageTypes, ServiceWorkerControllerCommand, ResponseForMessage, ServiceWorkerStatus, BroadcastChannelEventHandler } from "./types";


export function sendControlCommandToServiceWorker<
	M extends BroadcastMessage & {
		messageTarget: BroadcastChannelMember.ServiceWorker;
		messageType: BroadcastMessageTypes.COMMAND;
		content: ServiceWorkerControllerCommand;
	},
	R extends BroadcastMessage = ResponseForMessage<M> & {
		content: ServiceWorkerStatus;
		messageSource: BroadcastChannelMember.ServiceWorker;
	},
	H extends BroadcastChannelEventHandler<R> = BroadcastChannelEventHandler<R>
>(channelId: string, command: M["content"], responseHandler?: H) {
	return sendBroadcastMessageToServiceWorker<M, R, H>(
		channelId,
		{
			messageType: BroadcastMessageTypes.COMMAND,
			content: command,
			messageTarget: BroadcastChannelMember.ServiceWorker,
		} as M,
		responseHandler
	);
}
