import { ReactNode, useEffect, useState } from "react";
import { addBroadcastListener } from "~/lib/functions/AddBroadcastListener.ts";
import { sendControlCommandToServiceWorker } from "~/lib/functions/SendControlCommandToServiceWorker.ts";
import { sendStatusRequestToServiceWorker } from "~/lib/functions/SendStatusRequestToServiceWorker.ts";
import { BroadcastChannelMember } from "~/lib/types/BroadcastChannelMember.ts";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { ServiceWorkerControllerCommand } from "~/lib/types/ServiceWorkerControllerCommand.ts";
import { ServiceWorkerStatus } from "~/lib/types/ServiceWorkerStatus.ts";
import { SW_BROADCAST_CHANNEL } from "../constants";
import styles from "./ServiceWorkerControllerComponent.module.scss";
import Button from "~/components/button";

export function ServiceWorkerControllerComponent({
	channelId = SW_BROADCAST_CHANNEL,
}: {
	channelId?: string;
}): ReactNode {
	const [currentState, setCurrentState] = useState<ServiceWorkerStatus>();

	type ServiceWorkerStatusResponse = BroadcastMessage & {
		type: BroadcastMessageType.STATUS;
		content: ServiceWorkerStatus;
		source: BroadcastChannelMember.ServiceWorker;
	};

	useEffect(() => {
		addBroadcastListener<ServiceWorkerStatusResponse>(
			channelId,
			(evt: MessageEvent<ServiceWorkerStatusResponse>) => {
				setCurrentState(evt.data.content);
				console.log(currentState);
			},
			BroadcastChannelMember.Client,
			BroadcastChannelMember.ServiceWorker,
			BroadcastMessageType.STATUS
		);
	}, [channelId, currentState]);

	useEffect(() => {
		sendStatusRequestToServiceWorker(
			SW_BROADCAST_CHANNEL,
			(evt: MessageEvent) => {
				setCurrentState(evt.data.content);
			}
		);
	}, []);

	const handleSwCommand = (command: ServiceWorkerControllerCommand): void => {
		sendControlCommandToServiceWorker(
			SW_BROADCAST_CHANNEL,
			command,
			(evt): void => {
				setCurrentState(evt.data.content);
				console.log(currentState);
			}
		);
	};

	return (
		<header className={styles.header}>
			<h6>
				Service Worker{" "}
				{currentState && (
					<span>
						Status:{" "}
						{currentState.active
							? "active"
							: currentState.paused
							? "paused"
							: currentState.finished
							? "finished"
							: "idle"}
					</span>
				)}
			</h6>
			<div>
				<div className={styles.ccontrols}>
					<Button
						onClick={() =>
							handleSwCommand(ServiceWorkerControllerCommand.START)
						}
					>
						Start
					</Button>
					<Button
						onClick={() =>
							handleSwCommand(ServiceWorkerControllerCommand.PAUSE)
						}
					>
						Pause
					</Button>
					<Button
						onClick={() => handleSwCommand(ServiceWorkerControllerCommand.STOP)}
					>
						Stop
					</Button>
					<Button
						onClick={() =>
							sendStatusRequestToServiceWorker(
								SW_BROADCAST_CHANNEL,
								(evt: MessageEvent) => {
									setCurrentState(evt.data.content);
								}
							)
						}
					>
						Status
					</Button>
				</div>
			</div>
		</header>
	);
}
