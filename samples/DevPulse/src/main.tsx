import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "~/core/redux/store";
import App from "./App.tsx";
import "./index.css";
import initialiseServiceWorker from "./lib/functions/InitialiseServiceWorker";

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
