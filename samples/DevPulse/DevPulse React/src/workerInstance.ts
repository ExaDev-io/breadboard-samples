export const workerInstance = new Worker(
	new URL("./sw/worker", import.meta.url)
);