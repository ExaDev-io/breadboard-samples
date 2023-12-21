import { ReactNode } from "react";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { ServiceWorkerControllerComponent } from "./ServiceWorkerControllerComponent";
import BroadcastMessageRenderer from "./BroadcastMessageRenderer";
import { InputRequestsRenderer } from "./InputRequestsRenderer";
import { SW_BROADCAST_CHANNEL } from "../constants";

export function BreadboardComponent(): ReactNode {
	return (
		<div className="Breadboard">
			<ServiceWorkerControllerComponent />
			<InputRequestsRenderer />
			<BroadcastMessageRenderer
				channelId={SW_BROADCAST_CHANNEL}
				ignoreMatchers={[
					(message) => message.messageType != BroadcastMessageType.OUTPUT,
				]}
			/>
		</div>
	);
}
