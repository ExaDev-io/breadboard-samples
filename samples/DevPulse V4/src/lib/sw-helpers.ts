interface PeriodicSyncManager {
	register(tag: string, options?: { minInterval: number }): Promise<void>;
}

declare global {
	interface ServiceWorkerRegistration {
		readonly periodicSync: PeriodicSyncManager;
	}
}

export function initSW() {
	if ("serviceWorker" in navigator) {
		const basePath = import.meta.env.BASE_URL;
		const workerPath =
			import.meta.env.MODE === "production" ? "/sw.js" : "/dev-sw.js?dev-sw";

		const fullWorkerPath = `${
			basePath.endsWith("/") ? basePath.slice(0, -1) : basePath
		}${workerPath}`;

		navigator.serviceWorker.register(fullWorkerPath, {
			// 	type: import.meta.env.MODE === "production" ? "classic" : "module",
			type: "module",
		});

		if (navigator.serviceWorker.controller) {
			navigator.serviceWorker.addEventListener("controllerchange", () => {
				console.log("ServiceWorker", "controllerchange");
				window.location.reload();
			});
		}
		navigator.serviceWorker.ready.then(async (registration) => {
			console.log("ServiceWorker", "ready", registration);
		});
	}
}

export default initSW;
