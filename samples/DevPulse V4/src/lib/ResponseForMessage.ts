import { BroadcastMessage } from "~/lib/BroadcastMessage.tsx";

export type ResponseForMessage<T extends BroadcastMessage> = {
	id?: T["id"];
	// type?: T["type"];
	target?: T["messageSource"];
	source?: T["messageTarget"];
} & BroadcastMessage;
