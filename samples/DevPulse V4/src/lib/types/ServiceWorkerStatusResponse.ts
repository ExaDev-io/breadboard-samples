import { BroadcastChannelMember } from "~/lib/types/BroadcastChannelMember.ts";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { ServiceWorkerStatus } from "~/lib/types/ServiceWorkerStatus.ts";


export type ServiceWorkerStatusResponse = BroadcastMessage & {
	type: BroadcastMessageType.STATUS;
	content: ServiceWorkerStatus;
	source: BroadcastChannelMember.ServiceWorker;
};
