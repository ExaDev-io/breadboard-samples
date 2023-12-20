import { Schema } from "@google-labs/breadboard";
import { BroadcastChannelMember } from "~/lib/BroadcastChannelMember.ts";
import { BroadcastMessage } from "~/lib/BroadcastMessage.ts";

import { BroadcastMessageType } from "~/lib/BroadcastMessageType.ts";

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
