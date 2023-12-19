import React from "react";
import ReactDOM from "react-dom/client";
import App from "lib/App.tsx";
import "./index.css";
import { initSW } from "./lib/sw-helpers.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

initSW();
