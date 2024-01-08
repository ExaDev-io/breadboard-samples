export const ServiceWorkerControllerCommand = {
	START: "start",
	PAUSE: "pause",
	STOP: "stop"
} as const;

export type ServiceWorkerControllerCommand =
	(typeof ServiceWorkerControllerCommand)[keyof typeof ServiceWorkerControllerCommand];