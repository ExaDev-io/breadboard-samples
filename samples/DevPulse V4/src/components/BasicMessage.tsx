import { ReactNode } from "react";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";

type BasicMessageProps = {
	message: BroadcastMessage;
};

function BasicMessage({message}: BasicMessageProps): ReactNode {
	const renderContent = () => {
		if (typeof message === "object" && message !== null) {
			return <pre>{JSON.stringify(message, null, "\t")}</pre>;
		}
		return <div>{(message as string).toString()}</div>;
	};

	return (
		<div style={{
			fontFamily: "monospace",
			textAlign: "left",
			padding: "10px",
			margin: "5px",
			border: "1px solid grey",
			borderRadius: "5px"
		}}>
			{renderContent()}
		</div>
	);
}

export default BasicMessage;
