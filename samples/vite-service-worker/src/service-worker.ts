/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope;

self.addEventListener("fetch", (event: FetchEvent) => {
	console.log("ServiceWorker", "fetch", event);
	event.respondWith(fetch(event.request));
});

self.addEventListener("install", (event: ExtendableEvent) => {
	console.log("ServiceWorker", "install", event);
});

// add a persistent infinite loop that prints a counter every second
let counter = 0;
setInterval(() => {
	console.log(new Date().toISOString(), counter++);
}, 1000);

export {};
