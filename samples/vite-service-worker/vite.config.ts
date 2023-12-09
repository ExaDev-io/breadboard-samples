import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		// vite.config.js or vite.config.ts
		VitePWA({
			srcDir: "src",
			filename: "service-worker.ts",
			strategies: "injectManifest",
			injectRegister: false,
			manifest: false,
			devOptions: {
				enabled: true,
			},
			injectManifest: {
				injectionPoint: null,
			},
		}),
	],
});
