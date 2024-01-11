import { ReactNode } from "react";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { SW_BROADCAST_CHANNEL } from "../constants";
import BroadcastMessageRenderer from "./BroadcastMessageRenderer";
import { InputRequestsRenderer } from "./InputRequestsRenderer";
import { ServiceWorkerControllerComponent } from "./ServiceWorkerControllerComponent";

const searchInProgressMatcher: [((message: BroadcastMessage) => boolean), (() => ReactNode)] = [
	(message: BroadcastMessage): boolean => {
		return message.content != null && ("node" in (message.content as any)) && (message.content as any).node == "searchInProgress"
	},
	() => <div>Search in progress</div>,
];

const matchers: [((message: BroadcastMessage) => boolean), (() => ReactNode)][] = [
	searchInProgressMatcher
];

export function BreadboardComponent(): ReactNode {
	return <>
		<ServiceWorkerControllerComponent />
		<InputRequestsRenderer />
		<BroadcastMessageRenderer
			channelId={SW_BROADCAST_CHANNEL}
			ignoreMatchers={[
				(message) => message.messageType != BroadcastMessageType.OUTPUT,
			]}
			matchers={matchers}
		/>
	</>;
}
