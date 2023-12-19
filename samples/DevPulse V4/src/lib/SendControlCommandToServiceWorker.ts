import { BroadcastChannelEventHandler } from "~/lib/BroadcastChannelEventHandler.ts";
import { BroadcastChannelMember } from "~/lib/BroadcastChannelMember.ts";
import { BroadcastMessage, BroadcastMessageTypes } from "~/lib/BroadcastMessage.tsx";
import { ResponseForMessage } from "~/lib/ResponseForMessage.ts";
import { sendBroadcastMessageToServiceWorker } from "~/lib/SendBroadcastMessageToServiceWorker.ts";
import { ServiceWorkerControllerCommand } from "~/lib/ServiceWorkerControllerCommand.ts";
import { ServiceWorkerStatus } from "~/lib/ServiceWorkerStatus.ts";


export function sendControlCommandToServiceWorker<
	M extends BroadcastMessage & {
		target: BroadcastChannelMember.ServiceWorker;
		type: BroadcastMessageTypes.COMMAND;
		content: ServiceWorkerControllerCommand;
	},
	R extends BroadcastMessage = ResponseForMessage<M> & {
		content: ServiceWorkerStatus;
		source: BroadcastChannelMember.ServiceWorker;
	},
	H extends BroadcastChannelEventHandler<R> = BroadcastChannelEventHandler<R>
>(channelId: string, command: M["content"], responseHandler?: H) {
	return sendBroadcastMessageToServiceWorker<M, R, H>(
		channelId,
		{
			type: BroadcastMessageTypes.COMMAND,
			content: command,
			target: BroadcastChannelMember.ServiceWorker,
		} as M,
		responseHandler
	);
}
