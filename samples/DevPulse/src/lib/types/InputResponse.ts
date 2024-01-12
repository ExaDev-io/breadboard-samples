import { BroadcastChannelMember } from "~/lib/types/BroadcastChannelMember";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType";

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
