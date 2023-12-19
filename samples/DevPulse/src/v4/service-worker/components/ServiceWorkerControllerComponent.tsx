import { useEffect, useState } from "react";
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
import { SW_CONTROL_CHANNEL } from "~/lib/constants";
import styles from "../../../hnStory/components/worker-component.module.scss";
import Button from "~/components/button";

export function ServiceWorkerControllerComponent({
	channelId = SW_CONTROL_CHANNEL,
}: {
	channelId?: string;
}): JSX.Element {
	const [currentState, setCurrentState] = useState<ServiceWorkerStatus>();
	console.log(currentState);

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
				console.log(evt.data.content);
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
						SW_CONTROL_CHANNEL,
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
						SW_CONTROL_CHANNEL,
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
						SW_CONTROL_CHANNEL,
						ServiceWorkerControllerCommand.STOP,
						(evt): void => {
							setCurrentState(evt.data.content);
							console.log(evt.data.content);
						}
					)
				}
			>
				Stop
			</button>
			<main className={styles.main}>
				{currentState?.active && (
					<form className={styles.form} onSubmit={(e) => console.log(e)}>
						<label htmlFor="input" className={styles.label}>
							input
						</label>

						<input
							type="text"
							name="input"
							placeholder="input"
							className={styles.input}
						/>

						<Button type="submit" className={styles.button}>
							Submit
						</Button>
					</form>
				)}
			</main>
		</div>
	);
}
