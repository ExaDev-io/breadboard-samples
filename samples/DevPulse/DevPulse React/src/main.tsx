import React from "react";
import ReactDOM from "react-dom/client";
import board from "./hackerNewsBoard.ts";
// import { BreadboardContextProvider } from "./breadboardContext.tsx";
import "./index.css";
import TerminalOutput from "./TerminalOutput.tsx";


ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<TerminalOutput board={board}/>
	</React.StrictMode>
);
