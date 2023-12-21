import { ReactNode } from "react";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { InputRequest } from "~/lib/types/InputRequest.ts";
import { InputResponse } from "~/lib/types/InputResponse.ts";
import { FormComponent } from "./FormComponent";
import { SW_BROADCAST_CHANNEL } from "../constants";

export function BasicInput({
	request,
	onResponseSent,
}: {
	request: InputRequest;
	onResponseSent: () => void;
}): ReactNode {
	const node = request.content.node;
	const attribute = request.content.attribute;

	return (
		<div
			id={request.id}
			key={request.id}
			style={{
				fontFamily: "monospace",
				textAlign: "left",
				padding: "10px",
				margin: "5px",
				border: "1px solid grey",
				borderRadius: "5px",
			}}
		>
			<FormComponent
				// schema={schema}
				request={request}
				handleSubmit={(formData) => {
					const message: InputResponse = {
						id: request.id,
						messageType: BroadcastMessageType.INPUT_RESPONSE,
						messageSource: request.messageTarget,
						messageTarget: request.messageSource,
						content: {
							node: node,
							attribute: attribute,
							value: formData,
						},
					};
					new BroadcastChannel(SW_BROADCAST_CHANNEL).postMessage(message);
					onResponseSent();
				}}
			/>
		</div>
	);
}
