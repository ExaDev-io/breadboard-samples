import { UPDATE_CHECK } from "../constants";

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
			type: import.meta.env.MODE === "production" ? "classic" : "module",
		});

		if (navigator.serviceWorker.controller) {
			navigator.serviceWorker.controller.postMessage(UPDATE_CHECK);
			navigator.serviceWorker.addEventListener("controllerchange", () => {
				window.location.reload();
			});
		}
		navigator.serviceWorker.ready.then(async (registration) => {
			if ("periodicSync" in registration) {
				const status = await navigator.permissions.query({
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					name: "periodic-background-sync",
				});
				if (status.state === "granted") {
					await registration.periodicSync.register(UPDATE_CHECK, {
						minInterval: 24 * 60 * 60 * 1000,
					});
				}
			}
			if (window.matchMedia("(display-mode: standalone)").matches) {
				document.addEventListener("visibilitychange", () => {
					if (document.visibilityState !== "hidden") {
						navigator.serviceWorker.controller?.postMessage(UPDATE_CHECK);
						registration.update();
					}
				});
			}
		});
	}
}
