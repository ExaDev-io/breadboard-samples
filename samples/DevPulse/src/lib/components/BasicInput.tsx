import { ReactNode } from "react";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType";
import { InputRequest } from "~/lib/types/InputRequest";
import { InputResponse } from "~/lib/types/InputResponse";
import { SW_BROADCAST_CHANNEL } from "../constants";
import { FormComponent } from "./FormComponent";

export function BasicInput({
	request,
	onResponseSent,
	onSubmit
}: {
	request: InputRequest;
		onResponseSent: () => void;
	onSubmit: ()=>void;
}): ReactNode {
	const node = request.content.node;

	return (
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
						value: formData,
					},
				};
				onSubmit();
				new BroadcastChannel(SW_BROADCAST_CHANNEL).postMessage(message);
				onResponseSent();
			}}
		/>
	);
}
