import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		// vite.config.js or vite.config.ts
		VitePWA({
			filename: "sw.ts",
			includeManifestIcons: false,
			injectRegister: false,
			srcDir: "src/service-worker",
			strategies: "injectManifest",
			devOptions: {
				enabled: true,
			}

		}),
		tsconfigPaths()
	],
});
