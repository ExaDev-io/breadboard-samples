import { ServiceWorkerCommand } from "./serviceWorkerCommand.ts";
import { ServiceWorkerCommandEvent } from "./serviceWorkerCommandEvent.ts";
import { SW_CONTROL_CHANNEL } from "../constants";
import { boardRunner } from "../../service-worker/sw";
import { pendingInputResolvers } from "~/lib/sw/pendingInputResolvers.ts";
import ServiceWorkerRequest from "./ServiceWorkerRequest.ts";

export function commandHandler(data: ServiceWorkerCommandEvent) {
	console.log("ServiceWorker", "message", data);
	switch (data.command) {
		case ServiceWorkerCommand.inputResponse:
			if (data.node && data.value) {
				const resolver =
					pendingInputResolvers[`${data.node}-${data.attribute}`];
				if (resolver) {
					resolver(data.value);
					delete pendingInputResolvers[`${data.node}-${data.attribute}`];
				}
			}
			break;
		case ServiceWorkerCommand.start:
			boardRunner.start();
			break;
		case ServiceWorkerCommand.pause:
			boardRunner.pause();
			break;
		case ServiceWorkerCommand.stop:
			boardRunner.stop();
			break;
		case ServiceWorkerCommand.status:
			new BroadcastChannel(SW_CONTROL_CHANNEL).postMessage({
				command: "status",
				active: boardRunner.active,
				paused: boardRunner.paused,
				pendingInputResolvers: pendingInputResolvers,
			});
			break;
		default:
			if (Object.values(ServiceWorkerRequest).includes(data.command)) {
				console.debug(
					"ServiceWorker",
					"ignoring",
					"ServiceWorkerRequest",
					data
				);
				break;
			}
			console.error("ServiceWorker", "unknown command", data);
	}
}

export default commandHandler;
