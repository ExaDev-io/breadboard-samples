import { ReactNode, useEffect, useState } from "react";
import { SW_BROADCAST_CHANNEL } from "~/lib/constants/SW_BROADCAST_CHANNEL.ts";
import { addBroadcastListener } from "~/lib/functions/AddBroadcastListener";
import { sendControlCommandToServiceWorker } from "~/lib/functions/SendControlCommandToServiceWorker.ts";
import { sendStatusRequestToServiceWorker } from "~/lib/functions/SendStatusRequestToServiceWorker.ts";
import { BroadcastChannelMember } from "~/lib/types/BroadcastChannelMember";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType";
import { ServiceWorkerControllerCommand } from "~/lib/types/ServiceWorkerControllerCommand.ts";
import { ServiceWorkerStatus } from "~/lib/types/ServiceWorkerStatus.ts";
import { ServiceWorkerStatusResponse } from "~/lib/types/ServiceWorkerStatusResponse";

export function ServiceWorkerControllerComponent(): ReactNode {
	const [currentState, setCurrentState] = useState<ServiceWorkerStatus>();

	useEffect(() => {
		addBroadcastListener<ServiceWorkerStatusResponse>({
			handler: (evt: MessageEvent<ServiceWorkerStatusResponse>) => {
				setCurrentState(evt.data.content);
			},
			messageSource: BroadcastChannelMember.ServiceWorker,
			messageType: BroadcastMessageType.STATUS,
		});
		return () => {
			// cleanup
		};
	}, [currentState]);

	useEffect(() => {
		sendStatusRequestToServiceWorker();
	}, []);

	return (
		<div>
			{currentState && (
				<div>
					<p>Current state:</p>
					<pre
						style={{
							fontFamily: "monospace",
							textAlign: "left",
							padding: "10px",
							margin: "5px",
							border: "1px solid grey",
							borderRadius: "5px",
						}}
					>
						{JSON.stringify(currentState, null, 2)}
					</pre>
				</div>
			)}
			<div>
				<button
					onClick={() =>
						sendControlCommandToServiceWorker(
							SW_BROADCAST_CHANNEL,
							ServiceWorkerControllerCommand.START
						)
					}
				>
					Start
				</button>
				<button
					onClick={() => {
						sendControlCommandToServiceWorker(
							SW_BROADCAST_CHANNEL,
							ServiceWorkerControllerCommand.PAUSE
						);
					}}
				>
					Pause
				</button>
				<button
					onClick={() => {
						sendControlCommandToServiceWorker(
							SW_BROADCAST_CHANNEL,
							ServiceWorkerControllerCommand.STOP
						);
					}}
				>
					Stop
				</button>
				<button
					onClick={() =>
						sendStatusRequestToServiceWorker({
							channelId: SW_BROADCAST_CHANNEL,
						})
					}
				>
					Status
				</button>
			</div>
		</div>
	);
}
