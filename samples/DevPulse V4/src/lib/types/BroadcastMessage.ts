import { BroadcastChannelMember } from "~/lib/types/BroadcastChannelMember.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";

export type BroadcastMessage = {
	id?: string;
	content?: unknown;
	messageType?: BroadcastMessageType
	messageSource?: BroadcastChannelMember;
	messageTarget?: BroadcastChannelMember;
};
