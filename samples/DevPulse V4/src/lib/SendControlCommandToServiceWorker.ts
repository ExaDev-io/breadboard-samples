import { BroadcastChannelEventHandler } from "~/lib/types/BroadcastChannelEventHandler.ts";
import { BroadcastChannelMember } from "~/lib/types/BroadcastChannelMember.ts";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";

import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { ResponseForMessage } from "~/lib/types/ResponseForMessage.ts";
import { sendBroadcastMessageToServiceWorker } from "~/lib/SendBroadcastMessageToServiceWorker.ts";
import { ServiceWorkerControllerCommand } from "~/lib/types/ServiceWorkerControllerCommand.ts";
import { ServiceWorkerStatus } from "~/lib/types/ServiceWorkerStatus.ts";


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
