import React from "react";
import ReactDOM from "react-dom/client";
import { initialiseServiceWorker } from "~/lib/sw/initialiseServiceWorker.ts";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "~/core/redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { WorkerControllerProvider } from "./worker/workerControllerProvider.tsx";
import { SW_CONTROL_CHANNEL } from './lib/constants';

initialiseServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<WorkerControllerProvider broadcastChannel={SW_CONTROL_CHANNEL}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</WorkerControllerProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>
);

