import { BroadcastChannelMember } from "~/lib/types/BroadcastChannelMember.ts";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";

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
