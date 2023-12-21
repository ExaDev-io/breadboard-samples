import { BroadcastChannelEventHandler } from "../types/BroadcastChannelEventHandler";
import { BroadcastChannelMember } from "../types/BroadcastChannelMember";
import { BroadcastMessage } from "../types/BroadcastMessage";
import { BroadcastMessageType } from "../types/BroadcastMessageType";
import { ResponseForMessage } from "../types/ResponseForMessage";
import { ServiceWorkerControllerCommand } from "../types/ServiceWorkerControllerCommand";
import { ServiceWorkerStatus } from "../types/ServiceWorkerStatus";
import { sendBroadcastMessageToServiceWorker } from "./SendBroadcastMessageToServiceWorker";


export function sendControlCommandToServiceWorker<
	M extends BroadcastMessage & {
		messageTarget: BroadcastChannelMember.ServiceWorker;
		messageType: BroadcastMessageType.COMMAND;
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
			messageType: BroadcastMessageType.COMMAND,
			content: command,
			messageTarget: BroadcastChannelMember.ServiceWorker,
		} as M,
		responseHandler
	);
}
