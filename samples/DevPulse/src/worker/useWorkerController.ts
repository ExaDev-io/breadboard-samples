import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOutput, selectOutput } from "~/hnStory/outputSlice";
import { RootState } from "~/core/redux/store";
import useWorkerSteps from "~/hnStory/components/useWorkerSteps";
import { SW_CONTROL_CHANNEL } from "~/lib/constants";
import { WorkerStatus } from "../hnStory/components/worker-component";
import {
	BROADCAST_SOURCE,
	BROADCAST_TARGET,
	ClientBroadcastType,
	InputResponse,
	ServiceWorkerCommandValues,
} from "~/lib/sw/types";
import { StoryOutput } from "~/hnStory/domain";
import {
	ClientServiceWorkerCommandData,
	ClientInputResponseData,
} from "../lib/sw/types";

export type WorkerControllerHook = {
	input: InputResponse | null;
	// output: ReturnType<typeof selectOutput>;
	output: StoryOutput[];
	start: () => void;
	pause: () => void;
	stop: () => void;
	send: (data: InputResponse, clearInput?: boolean) => void;
	status: WorkerStatus;
	workerSteps: ReturnType<typeof useWorkerSteps>;
};

const useWorkerController = (
	bcChannel?: BroadcastChannel
): WorkerControllerHook => {
	const workerSteps = useWorkerSteps();
	const broadcastChannel = useMemo(() => {
		if (bcChannel) {
			return bcChannel;
		}
		return new BroadcastChannel(SW_CONTROL_CHANNEL);
	}, [bcChannel]);
	const [input, setInput] = useState<InputResponse | null>(null);

	const output = useSelector((state: RootState) => selectOutput(state));
	const [status, setStatus] = useState<WorkerStatus>("idle");
	const dispatch = useDispatch();
	const handleMessage = async (event: MessageEvent) => {
		console.log("message received", event.data);
		if (event.data.type === "inputNeeded") {
			const inputObject = {
				node: event.data.node!,
				attribute: event.data.attribute!,
				value: event.data.value!,
			};
			setInput(inputObject);
		}
		if (event.data.output) {
			dispatch(setOutput(event.data.output));
		}
		if (event.data.type === "status") {
			setStatus(event.data.status);
		}
	};

	useEffect(() => {
		if (status === "finished") {
			workerSteps.finalize();
		}
	}, [status, workerSteps]);

	useEffect(() => {
		if (!broadcastChannel) return;
		broadcastChannel.addEventListener("message", handleMessage);
		return () => broadcastChannel.removeEventListener("message", handleMessage);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const start = () => {
		const startCommand: ClientServiceWorkerCommandData = {
			type: ClientBroadcastType.SERVICE_WORKER_COMMAND,
			source: BROADCAST_SOURCE.CLIENT,
			target: BROADCAST_TARGET.SERVICE_WORKER,
			value: ServiceWorkerCommandValues.START,
		};
		broadcastChannel.postMessage(startCommand);
		setStatus(WorkerStatus.running);
	};

	const pause = () => {
		const pauseCommand: ClientServiceWorkerCommandData = {
			type: ClientBroadcastType.SERVICE_WORKER_COMMAND,
			source: BROADCAST_SOURCE.CLIENT,
			target: BROADCAST_TARGET.SERVICE_WORKER,
			value: ServiceWorkerCommandValues.PAUSE,
		};
		broadcastChannel.postMessage(pauseCommand);
		setStatus(WorkerStatus.paused);
	};

	const stop = () => {
		const stopCommand: ClientServiceWorkerCommandData = {
			type: ClientBroadcastType.SERVICE_WORKER_COMMAND,
			source: BROADCAST_SOURCE.CLIENT,
			target: BROADCAST_TARGET.SERVICE_WORKER,
			value: ServiceWorkerCommandValues.STOP,
		};
		broadcastChannel.postMessage(stopCommand);
		setStatus(WorkerStatus.stopped);
	};

	const send = (data: InputResponse) => {
		const inputData: ClientInputResponseData = {
			type: ClientBroadcastType.INPUT_RESPONSE,
			source: BROADCAST_SOURCE.CLIENT,
			target: BROADCAST_TARGET.SERVICE_WORKER,
			value: data,
		};
		broadcastChannel.postMessage(inputData);
	};

	return {
		input,
		output,
		start,
		pause,
		stop,
		send,
		status,
		workerSteps,
	};
};

export default useWorkerController;
