import { ReactNode, useEffect, useState } from "react";
import { addBroadcastListener } from "~/lib/functions/AddBroadcastListener.ts";
import { sendControlCommandToServiceWorker } from "~/lib/functions/SendControlCommandToServiceWorker.ts";
import { BroadcastChannelMember } from "~/lib/types/BroadcastChannelMember.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { ServiceWorkerControllerCommand } from "~/lib/types/ServiceWorkerControllerCommand.ts";
import { ServiceWorkerStatus } from "~/lib/types/ServiceWorkerStatus.ts";
import { SW_BROADCAST_CHANNEL } from "../constants";
import styles from "./ServiceWorkerControllerComponent.module.scss";
import Button from "~/components/button";
import { ServiceWorkerStatusResponse } from "../types/ServiceWorkerStatusResponse";
import { sendStatusRequestToServiceWorker } from "../functions/SendStatusRequestToServiceWorker";

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

	const handleSwCommand = (command: ServiceWorkerControllerCommand): void => {
		sendControlCommandToServiceWorker(SW_BROADCAST_CHANNEL, command);
	};

	const active =
		currentState?.active && !currentState?.paused && !currentState?.finished;

	return (
		<header className={styles.header}>
			<h6>
				Service Worker{" "}
				{currentState && (
					<span>
						Status:{" "}
						{active
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
							sendStatusRequestToServiceWorker({
								channelId: SW_BROADCAST_CHANNEL,
							})
						}
					>
						Status
					</Button>
				</div>
			</div>
		</header>
	);
}
