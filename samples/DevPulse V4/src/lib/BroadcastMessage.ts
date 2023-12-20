import { BroadcastChannelMember } from "~/lib/BroadcastChannelMember.ts";

import { BroadcastMessageType } from "~/lib/BroadcastMessageType.ts";

export type BroadcastMessage = {
	id?: string;
	content?: unknown;
	messageType?: BroadcastMessageType
	messageSource?: BroadcastChannelMember;
	messageTarget?: BroadcastChannelMember;
};
