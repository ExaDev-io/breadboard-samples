import { BroadcastMessageType } from "~/lib/BroadcastMessageType.ts";
import { SW_BROADCAST_CHANNEL } from "~/lib/constants.ts";
import { FormComponent } from "~/lib/FormComponent.tsx";
import { InputRequest } from "~/lib/InputRequest.ts";
import { InputResponse } from "~/lib/InputResponse.ts";

export function BasicInput({request}: { request: InputRequest; }) {
	const schema = request.content.schema;
	const node = request.content.node;
	const attribute = request.content.attribute;

	return (
		<div style={{
			fontFamily: "monospace",
			textAlign: "left",
			padding: "10px",
			margin: "5px",
			border: "1px solid grey",
			borderRadius: "5px"
		}}>
			<FormComponent
				schema={schema}
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
				}}/>
		</div>
	);
}
