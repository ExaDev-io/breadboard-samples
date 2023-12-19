import { useEffect, useState } from "react";
import { SW_BROADCAST_CHANNEL } from "../../lib/constants";
import {
	BroadcastChannelMember,
	BroadcastMessage,
	BroadcastMessageTypes,
	ServiceWorkerControllerCommand,
	ServiceWorkerStatus,
} from "../../lib/types";
import { addBroadcastListener } from "../../lib/AddBroadcastListener";
import { sendStatusRequestToServiceWorker } from "../../lib/SendStatusRequestToServiceWorker";
import { sendControlCommandToServiceWorker } from "../../lib/SendControlCommandToServiceWorker";

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
		});
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
						}
					)
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
