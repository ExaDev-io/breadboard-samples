import React from "react";
import ReactDOM from "react-dom/client";
import { initialiseServiceWorker } from "~/lib/sw/initialiseServiceWorker.ts";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "~/core/redux/store.ts";
import { BrowserRouter } from "react-router-dom";

initialiseServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
);
