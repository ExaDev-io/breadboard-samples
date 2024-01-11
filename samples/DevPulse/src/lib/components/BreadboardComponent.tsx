import { ReactNode } from "react";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { SW_BROADCAST_CHANNEL } from "../constants";
import BroadcastMessageRenderer from "./BroadcastMessageRenderer";
import { InputRequestsRenderer } from "./InputRequestsRenderer";
import { ServiceWorkerControllerComponent } from "./ServiceWorkerControllerComponent";

const matchSearchInProgress = (message: BroadcastMessage): boolean => {
	return message.content != null && ("node" in (message.content as any)) && (message.content as any).node == "searchInProgress"
}
export function BreadboardComponent(): ReactNode {
	let matchers: [((message: BroadcastMessage) => boolean), (() => JSX.Element)][] = [
		[
			(message) => matchSearchInProgress(message),
			() => <div>Search in progress...</div>,
		]
	];

	return (
		<>
			<ServiceWorkerControllerComponent />
			<InputRequestsRenderer />
			<BroadcastMessageRenderer
				channelId={SW_BROADCAST_CHANNEL}
				ignoreMatchers={[
					(message) => message.messageType != BroadcastMessageType.OUTPUT,
				]}
				matchers={matchers}
			/>
		</>
	);
}
