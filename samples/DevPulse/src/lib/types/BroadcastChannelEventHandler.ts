import { BroadcastMessage } from "~/lib/types/BroadcastMessage";

export interface BroadcastChannelEventHandler<
	M extends BroadcastMessage,
	E = MessageEvent<M>
> {
	(evt: E): void;
}
