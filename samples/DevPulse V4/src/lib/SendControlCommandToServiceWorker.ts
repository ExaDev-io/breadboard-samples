import { BroadcastChannelEventHandler } from "~/lib/types.ts";
import { BroadcastChannelMember } from "~/lib/types.ts";
import { BroadcastMessage, BroadcastMessageTypes } from "~/lib/types.ts";
import { ResponseForMessage } from "~/lib/types.ts";
import { ServiceWorkerControllerCommand } from "~/lib/types.ts";
import { ServiceWorkerStatus } from "~/lib/types.ts";
import { sendBroadcastMessageToServiceWorker } from "./SendBroadcastMessageToServiceWorker";


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
