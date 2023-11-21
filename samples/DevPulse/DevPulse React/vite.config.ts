import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import react from '@vitejs/plugin-react';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import open, { openApp, apps } from "open";


const SERVER_PORT = 5173;
async function openChrome() {
	const args = [
		// `http://localhost:${SERVER_PORT}`,
		"--args",
		"--disable-fre",
		"--no-default-browser-check",
		"--no-first-run",
		`--user-data-dir=/tmp/${new Date().getDate()}`,
		"--disable-web-security",
		"--disable-gpu",
		"--no-startup-window",
		"--disable-site-isolation-trials",
	];

	return await openApp(apps.chrome, {
		arguments: args,
		background: true,
		newInstance: false,
		wait: false,
	}).then(() => {
		return "";
	});
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
