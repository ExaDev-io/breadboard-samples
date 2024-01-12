import { BroadcastChannelMember } from "~/lib/types/BroadcastChannelMember";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType";
import { ServiceWorkerStatus } from "~/lib/types/ServiceWorkerStatus";


export type ServiceWorkerStatusResponse = BroadcastMessage & {
	type: BroadcastMessageType.STATUS;
	content: ServiceWorkerStatus;
	source: BroadcastChannelMember.ServiceWorker;
};
