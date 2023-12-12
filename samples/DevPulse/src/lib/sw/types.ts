import { Schema } from "@google-labs/breadboard";

export const SERVICE_WORKER = "service-worker";
//
export type SERVICE_WORKER = typeof SERVICE_WORKER;
//
export const CLIENT = "client";
//
export type CLIENT = typeof CLIENT;
//
export const BROADCAST_SOURCE = {
	SERVICE_WORKER,
	CLIENT,
} as const;
//
export type BROADCAST_SOURCE =
	(typeof BROADCAST_SOURCE)[keyof typeof BROADCAST_SOURCE];
//
export const BROADCAST_TARGET = { SERVICE_WORKER };
//
export type BROADCAST_TARGET =
	(typeof BROADCAST_TARGET)[keyof typeof BROADCAST_TARGET];
//
export const ServiceWorkerCommandValues = {
	STOP: "STOP",
	PAUSE: "PAUSE",
	START: "START",
	STATUS: "STATUS",
} as const;
//
export type ServiceWorkerCommandValues =
	(typeof ServiceWorkerCommandValues)[keyof typeof ServiceWorkerCommandValues];
//
export const ClientBroadcastType = {
	SERVICE_WORKER_COMMAND: "SERVICE_WORKER_COMMAND",
	INPUT_RESPONSE: "INPUT_RESPONSE",
} as const;
//
export type ClientBroadcastType =
	(typeof ClientBroadcastType)[keyof typeof ClientBroadcastType];
//
export const ServiceWorkerBroadcastType = {
	INPUT_NEEDED: "INPUT_NEEDED",
	OUTPUT: "OUTPUT",
	STATUS: "STATUS",
} as const;
//
export type ServiceWorkerBroadcastType =
	(typeof ServiceWorkerBroadcastType)[keyof typeof ServiceWorkerBroadcastType];
//
export const BroadcastType = {
	...ClientBroadcastType,
	...ServiceWorkerBroadcastType,
} as const;
//
export type BroadcastType = (typeof BroadcastType)[keyof typeof BroadcastType];
//
export type BroadcastData = {
	type: BroadcastType;
	value?: unknown;
	source?: BROADCAST_SOURCE;
	target?: BROADCAST_TARGET;
};
export type BroadcastEvent = MessageEvent<BroadcastData>;
//
export type ClientBroadcastData = BroadcastData & {
	type: ClientBroadcastType;
	source: typeof BROADCAST_SOURCE.CLIENT;
};
export type ClientBroadcastEvent = MessageEvent<ClientBroadcastData>;
//
export type ServiceWorkerCommandData = BroadcastData & {
	type: typeof ClientBroadcastType.SERVICE_WORKER_COMMAND;
	target: typeof BROADCAST_TARGET.SERVICE_WORKER;
	value: ServiceWorkerCommandValues;
};
//
export type ClientServiceWorkerCommandData = ClientBroadcastData &
	ServiceWorkerCommandData;
//
export type ServiceWorkerBroadcastData = BroadcastData & {
	type: ServiceWorkerBroadcastType;
	source: typeof BROADCAST_SOURCE.SERVICE_WORKER;
};
//
export type ServiceWorkerBroadcastEvent =
	MessageEvent<ServiceWorkerBroadcastData>;
//
export type InputRequest = {
	node: string;
	attribute: string;
	schema: Schema;
};
//
export type ServiceWorkerInputRequestData = ServiceWorkerBroadcastData & {
	type: typeof ServiceWorkerBroadcastType.INPUT_NEEDED;
	value: InputRequest;
};
//
export type ServiceWorkerInputRequestEvent =
	MessageEvent<ServiceWorkerInputRequestData>;
//
export type InputResponse = {
	node: string;
	attribute: string;
	value: unknown;
};
//
export type ClientInputResponseData = ClientBroadcastData & {
	type: typeof ClientBroadcastType.INPUT_RESPONSE;
	target: typeof BROADCAST_TARGET.SERVICE_WORKER;
	value: InputResponse;
};
//
export type ClientInputResponseEvent = MessageEvent<ClientInputResponseData>;
//
export type ServiceWorkerOutputData = ServiceWorkerBroadcastData & {
	type: typeof ServiceWorkerBroadcastType.OUTPUT;
	value: {
		[key: string]: unknown;
	};
};
// export type STATUS = typeof ServiceWorkerBroadcastType.STATUS;

//
export type ServiceWorkerStatusData = ServiceWorkerBroadcastData & {
	type: typeof ServiceWorkerBroadcastType.STATUS;
	value: {
		active: boolean;
		paused: boolean;
		pendingInputResolvers: Record<string, unknown>;
	};
};
