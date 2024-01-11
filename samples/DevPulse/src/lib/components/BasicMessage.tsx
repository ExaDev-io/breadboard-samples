import { ReactNode } from "react";
import { StoryOutput } from "~/hnStory/domain";

type BasicMessageProps = {
	output: StoryOutput;
};

function BasicMessage({ output }: BasicMessageProps): ReactNode {
	const renderContent = () => {
		return <div>{JSON.stringify(output)}</div>;
	};

	return (
		<div
			style={{
				fontFamily: "monospace",
				textAlign: "left",
				padding: "10px",
				margin: "5px",
				border: "1px solid grey",
				borderRadius: "5px",
			}}
		>
			{renderContent()}
		</div>
	);
}

export default BasicMessage;
