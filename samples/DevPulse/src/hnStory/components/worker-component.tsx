import React from "react";
import { useWorkerControllerContext } from "worker/useWorkerControllerContext.tsx";
import styles from "./worker-component.module.scss";
import { StoryOutput } from "~/hnStory/domain";
import Button from "~/components/button";
import OutputAccordion from "~/hnStory/components/output-accordion";
import { SW_CONTROL_CHANNEL } from '../../lib/constants';
import { BROADCAST_SOURCE, ClientInputResponseData, InputResponse, BROADCAST_TARGET, ClientBroadcastType } from '../../lib/sw/types';

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
	const { broadcastChannel, workerSteps } =
		useWorkerControllerContext();
	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement>,
		node: string,
		attribute: string
	) => {
		e.preventDefault();
		const input = (e.target as HTMLFormElement).querySelector("input");

		const inputObject: InputResponse = {
			node,
			attribute,
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
	};
	const running = broadcastChannel.status === WorkerStatus.running;
	//const inputField = useSelector((state: RootState) => selectInput(state))

	return (
		<div>
			<header className={styles.header}>
				<h6>
					Service Worker{" "}
					<span>Status: {broadcastChannel.status}</span>
				</h6>
				<div className={styles.ccontrols}>
					<Button onClick={broadcastChannel.start}>Start</Button>
					<Button
						onClick={broadcastChannel.pause}
						disabled={!running}
					>
						Pause
					</Button>
					<Button onClick={broadcastChannel.stop} disabled={!running}>
						Stop
					</Button>
				</div>
			</header>

			<main className={styles.main}>
				{broadcastChannel.status === WorkerStatus.running && (
					<form
						className={styles.form}
						onSubmit={(e) =>
							handleSubmit(
								e,
								broadcastChannel.input?.node || "",
								broadcastChannel.input?.attribute || ""
							)
						}
					>
						<label htmlFor="input" className={styles.label}>
							{JSON.stringify(broadcastChannel.input?.value) || ""}
						</label>

						<input
							type="text"
							name="input"
							placeholder={`${broadcastChannel.input?.node}`}
							className={styles.input}
						/>

						<Button type="submit" className={styles.button}>Submit</Button>
					</form>
				)}
			</main>

			<OutputAccordion
				data={broadcastChannel.output as StoryOutput[]}
				nodeId="searchResultData"
			/>
		</div>
	);
};

export default WorkerComponent;
