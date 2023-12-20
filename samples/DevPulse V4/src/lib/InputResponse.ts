import { BroadcastChannelMember } from "~/lib/BroadcastChannelMember.ts";
import { BroadcastMessage } from "~/lib/BroadcastMessage.ts";

import { BroadcastMessageType } from "~/lib/BroadcastMessageType.ts";

export interface InputResponse extends BroadcastMessage {
	id: string;
	messageType: BroadcastMessageType.INPUT_RESPONSE;
	messageSource: BroadcastChannelMember;
	messageTarget: BroadcastChannelMember;
	content: {
		node: string;
		attribute: string;
		value: unknown;
	};
}
