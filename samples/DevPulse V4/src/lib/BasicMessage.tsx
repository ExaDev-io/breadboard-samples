import { BroadcastMessage } from "~/lib/BroadcastMessage.tsx";

type BasicMessageProps = {
	message: BroadcastMessage;
};

const BasicMessage = ({ message }: BasicMessageProps): React.JSX.Element => {
	const renderContent = () => {
		if (typeof message === "object" && message !== null) {
			return <pre>{JSON.stringify(message, null, 2)}</pre>;
		}
		return <div>{(message as string).toString()}</div>;
	};

	return (
		<div style={{ padding: "10px", margin: "5px", border: "1px solid grey" }}>
			{renderContent()}
		</div>
	);
};

export default BasicMessage;
