import { ReactNode, useEffect, useState } from "react";
import Button from "~/components/button";
import { addBroadcastListener } from "~/lib/functions/AddBroadcastListener";
import { sendControlCommandToServiceWorker } from "~/lib/functions/SendControlCommandToServiceWorker";
import { BroadcastChannelMember } from "~/lib/types/BroadcastChannelMember";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType";
import { ServiceWorkerControllerCommand } from "~/lib/types/ServiceWorkerControllerCommand";
import { ServiceWorkerStatus } from "~/lib/types/ServiceWorkerStatus";
import { SW_BROADCAST_CHANNEL } from "../constants";
import { sendStatusRequestToServiceWorker } from "../functions/SendStatusRequestToServiceWorker";
import { ServiceWorkerStatusResponse } from "../types/ServiceWorkerStatusResponse";
import styles from "./ServiceWorkerControllerComponent.module.scss";

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
				<div className={styles.controls}>
					<Button
						onClick={() =>
							handleSwCommand(ServiceWorkerControllerCommand.START)
						}
						disabled={active}
						variant="positive"
					>
						Start
					</Button>
					<Button
						onClick={() =>
							handleSwCommand(ServiceWorkerControllerCommand.PAUSE)
						}
						disabled={!active}
					>
						Pause
					</Button>
					<Button
						onClick={() => handleSwCommand(ServiceWorkerControllerCommand.STOP)}
						disabled={!active}
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
