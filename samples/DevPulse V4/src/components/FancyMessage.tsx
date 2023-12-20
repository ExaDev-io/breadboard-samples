import { ReactNode } from "react";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";

type FancyMessageProps = {
	message: BroadcastMessage;
};

export function FancyMessage({message}: FancyMessageProps): ReactNode {
	return <div style={{color: "blue"}}>
		<p>{message.content as string}</p>
	</div>;
}

export default FancyMessage;
