export type ServiceWorkerStatus = {
	active: boolean;
	paused: boolean;
	finished: boolean;
	pendingInputResolvers?: Record<string, unknown>;
};
