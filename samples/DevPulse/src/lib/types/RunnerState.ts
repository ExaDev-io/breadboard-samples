import { InputRequest } from "./InputRequest";
import { ServiceWorkerStatus } from "./ServiceWorkerStatus";


export type InputResolver = (input: string) => void;

export type PendingInputResolvers = {
	[key: string]: InputResolver;
};

export type PendingInputrequests = {
	[key: string]: InputRequest;
};

export type RunnerState = {
	pendingInputs: {
		resolvers: PendingInputResolvers;
		requests: PendingInputrequests;
	};
} & ServiceWorkerStatus;