import { BroadcastMessage } from "~/lib/BroadcastMessage.ts";

export interface BroadcastChannelEventHandler<
	M extends BroadcastMessage,
	E = MessageEvent<M>
> {
	(evt: E): void;
}
