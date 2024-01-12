import { BroadcastMessage } from "~/lib/types/BroadcastMessage";

export type ResponseForMessage<T extends BroadcastMessage> = {
	id?: T["id"];
	// type?: T["type"];
	target?: T["messageSource"];
	source?: T["messageTarget"];
} & BroadcastMessage;
