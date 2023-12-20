import { Schema } from "@google-labs/breadboard";
import { BroadcastChannelMember } from "~/lib/types/BroadcastChannelMember.ts";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";

export interface InputRequest extends BroadcastMessage {
	id: string;
	messageType: BroadcastMessageType.INPUT_REQUEST;
	messageSource: BroadcastChannelMember;
	messageTarget: BroadcastChannelMember;
	content: {
		node: string;
		attribute: string;
		schema: Schema;
	};
}
