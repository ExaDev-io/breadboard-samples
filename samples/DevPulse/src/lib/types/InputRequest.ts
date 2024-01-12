import { Schema } from "@google-labs/breadboard";
import { BroadcastChannelMember } from "~/lib/types/BroadcastChannelMember";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType";

export interface InputRequest extends BroadcastMessage {
	id: string;
	messageType: BroadcastMessageType.INPUT_REQUEST;
	messageSource: BroadcastChannelMember;
	messageTarget: BroadcastChannelMember;
	content: {
		node: string;
		schema: Schema;
	};
	[key: string]: unknown;
}
