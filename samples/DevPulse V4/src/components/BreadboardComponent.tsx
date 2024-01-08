import { ReactNode } from "react";
import BroadcastMessageRenderer from "~/components/BroadcastMessageRenderer.tsx";
import { InputRequestsRenderer } from "~/components/InputRequestsRenderer.tsx";
import { ServiceWorkerControllerComponent } from '~/components/ServiceWorkerControllerComponent.tsx';
import { SW_BROADCAST_CHANNEL } from "~/lib/constants";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";

export function BreadboardComponent(): ReactNode {
	return <div className="Breadboard">
		<InputRequestsRenderer />
		<ServiceWorkerControllerComponent/>
		<BroadcastMessageRenderer
			channelId={SW_BROADCAST_CHANNEL}
			ignoreMatchers={[
				(message) => message.messageType != BroadcastMessageType.OUTPUT,
			]}
		/>
	</div>
}
