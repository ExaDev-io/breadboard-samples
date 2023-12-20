import { InputRequest } from "./InputRequest";

export type ServiceWorkerStatus = {
	active: boolean;
	paused: boolean;
	finished: boolean;
	inputRequests?: { [key: string]: InputRequest; };
};
