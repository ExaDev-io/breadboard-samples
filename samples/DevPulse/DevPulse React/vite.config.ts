import react from "@vitejs/plugin-react-swc";
import { apps, openApp } from "open";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
// import react from '@vitejs/plugin-react';
import wasm from "vite-plugin-wasm";


const SERVER_PORT = 5173;
async function openChrome() {
	const args = [
		"--args",
		"--disable-fre",
		"--no-default-browser-check",
		"--no-first-run",
		`--user-data-dir=/tmp/${new Date().toDateString()}`,
		"--disable-web-security",
		"--disable-gpu",
		"--no-startup-window",
		"--disable-site-isolation-trials",
		"--auto-open-devtools-for-tabs",
		"--new-window",
		"--incognito",
		`http://localhost:${SERVER_PORT}`,
	];

	return await openApp(apps.chrome, {
		arguments: args,
		background: false,
		newInstance: false,
		wait: false,
	})

	// return await open(
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [wasm(), react(), topLevelAwait()],
	build: {
		target: "esnext",
	},
	worker: {
	},
	preview: {
		cors: false,
		port: SERVER_PORT,
		open: await openChrome(),
	},

	server: {
		cors: false,
		port: SERVER_PORT,
		// cors: { origin: "*" },
		open: await openChrome(),
		strictPort: true,
	},
});
