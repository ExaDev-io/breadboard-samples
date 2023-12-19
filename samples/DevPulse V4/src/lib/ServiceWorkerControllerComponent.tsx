import { useEffect, useState } from "react";
import { addBroadcastListener } from "~/lib/AddBroadcastListener.ts";
import { BroadcastChannelMember } from "~/lib/BroadcastChannelMember.ts";
import { BroadcastMessage, BroadcastMessageTypes } from "~/lib/BroadcastMessage.tsx";
import { SW_BROADCAST_CHANNEL } from "~/lib/constants.ts";
import { sendControlCommandToServiceWorker } from "~/lib/SendControlCommandToServiceWorker.ts";
import { sendStatusRequestToServiceWorker } from "~/lib/SendStatusRequestToServiceWorker.ts";
import { ServiceWorkerControllerCommand } from "~/lib/ServiceWorkerControllerCommand.ts";
import { ServiceWorkerStatus } from "~/lib/ServiceWorkerStatus.ts";


export function ServiceWorkerControllerComponent({
	                                                 channelId = SW_BROADCAST_CHANNEL,
                                                 }: {
	channelId?: string;
}): JSX.Element {
	const [currentState, setCurrentState] = useState<ServiceWorkerStatus>();

	type ServiceWorkerStatusResponse = BroadcastMessage & {
		type: BroadcastMessageTypes.STATUS;
		content: ServiceWorkerStatus;
		source: BroadcastChannelMember.ServiceWorker;
	};

	useEffect(() => {
		addBroadcastListener<ServiceWorkerStatusResponse>(
			channelId,
			(evt: MessageEvent<ServiceWorkerStatusResponse>) => {
				setCurrentState(evt.data.content);
			},
			BroadcastChannelMember.ServiceWorker,
			BroadcastChannelMember.Client,
			BroadcastMessageTypes.STATUS
		);
	}, [channelId, currentState]);

	useEffect(() => {
		sendStatusRequestToServiceWorker(undefined, (evt) => {
			setCurrentState(evt.data.content);
		})
	}, []);

	return (
		<div>
			<button
				onClick={() =>
					sendControlCommandToServiceWorker(
						SW_BROADCAST_CHANNEL,
						ServiceWorkerControllerCommand.START,
						(evt): void => {
							setCurrentState(evt.data.content);
						}
					)
				}
			>
				Start
			</button>
			<button
				onClick={() =>
					sendControlCommandToServiceWorker(
						SW_BROADCAST_CHANNEL,
						ServiceWorkerControllerCommand.PAUSE,
						(evt): void => {
							setCurrentState(evt.data.content);
						})
				}
			>
				Pause
			</button>
			<button
				onClick={() =>
					sendControlCommandToServiceWorker(
						SW_BROADCAST_CHANNEL,
						ServiceWorkerControllerCommand.STOP,
						(evt): void => {
							setCurrentState(evt.data.content);
						}
					)
				}
			>
				Stop
			</button>
		</div>
	);
}
