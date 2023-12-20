import { BroadcastMessage } from "~/lib/BroadcastMessage.ts";

export type ResponseForMessage<T extends BroadcastMessage> = {
	id?: T["id"];
	// type?: T["type"];
	target?: T["messageSource"];
	source?: T["messageTarget"];
} & BroadcastMessage;
