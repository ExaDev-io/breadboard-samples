import { BroadcastMessage } from "~/lib/BroadcastMessage.tsx";

export interface BroadcastChannelEventHandler<
	M extends BroadcastMessage,
	E = MessageEvent<M>
> {
	(evt: E): void;
}
