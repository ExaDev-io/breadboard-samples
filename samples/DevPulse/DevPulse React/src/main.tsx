import React from "react";
import ReactDOM from "react-dom/client";
import board from "./hackerNewsBoard.ts";
import App from "./TerminalOutput.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App  board={board}/>
	</React.StrictMode>
);
