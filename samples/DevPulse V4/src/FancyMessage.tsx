import { BroadcastMessage } from "./lib/BroadcastMessage";
import React from "react";

type FancyMessageProps = {
	message: BroadcastMessage;
};

const FancyMessage = ({ message }: FancyMessageProps): React.JSX.Element => (
	<div style={{ color: "blue" }}>
		<p>{message.content as string}</p>
	</div>
);

export default FancyMessage;
