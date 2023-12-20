import React from "react";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";

type FancyMessageProps = {
	message: BroadcastMessage;
};

function FancyMessage({message}: FancyMessageProps): React.JSX.Element {
	return <div style={{color: "blue"}}>
		<p>{message.content as string}</p>
	</div>;
}

export default FancyMessage;
