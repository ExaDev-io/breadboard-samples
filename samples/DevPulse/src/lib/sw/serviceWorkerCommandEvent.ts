/// <reference lib="webworker" />

import { ServiceWorkerCommand } from "~/lib/sw/serviceWorkerCommand.ts";

// export type ServiceWorkerCommandEvent = MessageEvent<{
// 	command: ServiceWorkerCommand;
// }>;

// export interface ServiceWorkerCommandEvent
// 	extends MessageEvent<{ command: ServiceWorkerCommand }> {}

export type ServiceWorkerCommandEvent = MessageEvent & {
	command: ServiceWorkerCommand;
	node?: string;
	attribute?: string;
	value?: string;
};
export default ServiceWorkerCommandEvent;
