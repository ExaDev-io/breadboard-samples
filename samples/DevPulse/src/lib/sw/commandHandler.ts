import {
	BROADCAST_SOURCE,
	ClientBroadcastData,
	ClientInputResponseData,
	ServiceWorkerBroadcastType,
	ServiceWorkerCommandData,
	ServiceWorkerCommandValues,
	ServiceWorkerStatusData,
} from "~/lib/sw/types.ts";
import { pendingInputResolvers } from "~/lib/sw/pendingInputResolvers.ts";
import { boardRunner } from "~/service-worker/sw.ts";
import { serviceWorkerOutputBroadcast } from "./runResultHandler.ts";
import { ClientBroadcastType } from "~/lib/sw/types";

export function commandHandler(data: ClientBroadcastData) {
	console.log("ServiceWorker", "message", data);
	if (data.type === ClientBroadcastType.INPUT_RESPONSE) {
		if (data.value) {
			const clientInputResponseData = data as ClientInputResponseData;
			const resolverKey = `${clientInputResponseData.value.node}-${clientInputResponseData.value.attribute}`;
			const resolver = pendingInputResolvers[resolverKey];
			if (resolver) {
				resolver(clientInputResponseData.value.value as never);
				delete pendingInputResolvers[resolverKey];
			}
		}
	} else if (data.type === ClientBroadcastType.SERVICE_WORKER_COMMAND) {
		const commandData = data as ServiceWorkerCommandData;
		serviceWorkerCommandHandler(commandData);
	} else {
		console.error("ServiceWorker", "unknown command", data);
	}
}

export function serviceWorkerCommandHandler(data: ServiceWorkerCommandData) {
	switch (data.value) {
		case ServiceWorkerCommandValues.START:
			boardRunner.start();
			break;
		case ServiceWorkerCommandValues.PAUSE:
			boardRunner.pause();
			break;
		case ServiceWorkerCommandValues.STOP:
			boardRunner.stop();
			break;
		case ServiceWorkerCommandValues.STATUS:
			serviceWorkerOutputBroadcast({
				type: ServiceWorkerBroadcastType.STATUS,
				source: BROADCAST_SOURCE.SERVICE_WORKER,
				value: {
					active: boardRunner.active,
					paused: boardRunner.paused,
					pendingInputResolvers: pendingInputResolvers,
				},
			} as ServiceWorkerStatusData);
			break;
		default:
			console.error("ServiceWorker", "unknown command", data);
	}
}

export default commandHandler;
