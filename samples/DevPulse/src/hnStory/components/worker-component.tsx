import React from "react";
import styles from "./worker-component.module.scss";
import { SW_CONTROL_CHANNEL } from "../../lib/constants";
import BroadcastMessageRenderer from "~/v4/service-worker/components/BroadcastMessageRenderer";
import { ServiceWorkerControllerComponent } from "~/v4/service-worker/components/ServiceWorkerControllerComponent";

export const WorkerStatus = {
	idle: "idle",
	running: "running",
	paused: "paused",
	stopped: "stopped",
	loading: "loading",
	finished: "finished",
} as const;

export type WorkerStatus = (typeof WorkerStatus)[keyof typeof WorkerStatus];

export const WorkerComponent: React.FC = () => {
	/* const { broadcastChannel, workerSteps } = useWorkerControllerContext();
	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement>,
		node: string,
		schema: Schema,
		attribute: string
	) => {
		e.preventDefault();
		const input = (e.target as HTMLFormElement).querySelector("input");

		const inputObject: InputResponse = {
			node,
			attribute,
			schema,
			value: input?.value,
		};
		workerSteps.addStep(inputObject);

		const message: ClientInputResponseData = {
			type: ClientBroadcastType.INPUT_RESPONSE,
			source: BROADCAST_SOURCE.CLIENT,
			target: BROADCAST_TARGET.SERVICE_WORKER,
			value: inputObject,
		};
		new BroadcastChannel(SW_CONTROL_CHANNEL).postMessage(message);
	}; */

	//const inputField = useSelector((state: RootState) => selectInput(state))
	return (
		<div>
			<header className={styles.header}>
				<BroadcastMessageRenderer channelId={SW_CONTROL_CHANNEL} />
				<ServiceWorkerControllerComponent />
			</header>

			{/* <OutputAccordion
				data={broadcastChannel.output}
				nodeId="searchResultData"
			/> */}
		</div>
	);
};

export default WorkerComponent;
