import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOutput, selectOutput } from "~/hnStory/outputSlice";
import { RootState } from "~/core/redux/store";
import useWorkerSteps from "~/hnStory/components/useWorkerSteps";
import { SW_CONTROL_CHANNEL } from "~/lib/constants";

import {
	BROADCAST_SOURCE,
	BROADCAST_TARGET,
	BroadcastData,
	ClientBroadcastType,
	InputRequest,
	InputResponse,
	ServiceWorkerCommandValues,
	ServiceWorkerStatus,
} from "~/lib/sw/types";
import { StoryOutput } from "~/hnStory/domain";
import {
	BroadcastEvent,
	ServiceWorkerBroadcastType,
	ServiceWorkerStatusData,
} from "../lib/sw/types";
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
	status: ServiceWorkerStatus;
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
	const [status, setStatus] = useState<ServiceWorkerStatus>({
		active: false,
		paused: false,
		finished: false,
		pendingInputResolvers: {},
	});
	const dispatch = useDispatch();
	const handleMessage = async (event: BroadcastEvent) => {
		console.log("Client", "message received", event.data);
		const broadcastData = event.data as BroadcastData;
		if (broadcastData.type && broadcastData.type === ServiceWorkerBroadcastType.INPUT_NEEDED) {
			const inputRequest = broadcastData.value as InputRequest;
			setInput({
				node: inputRequest.node,
				attribute: inputRequest.attribute,
				schema: inputRequest.schema,
				value: ""
			})
		} else if (
			broadcastData.type &&
			broadcastData.type === ClientBroadcastType.INPUT_RESPONSE
		) {
			if (broadcastData.value) {
				const clientInputResponseData =
					broadcastData.value as ClientInputResponseData;
				const inputObject = {
					node: clientInputResponseData.value.node,
					attribute: clientInputResponseData.value.attribute,
					schema: clientInputResponseData.value.schema,
					value: clientInputResponseData.value.value,
				};
				console.log(clientInputResponseData);
				setInput(inputObject);
			}
			
		} else if (
			broadcastData.type &&
			broadcastData.type === ServiceWorkerBroadcastType.OUTPUT
		) {
			dispatch(setOutput(event.data.value));
			
		} else if (
			broadcastData.type &&
			broadcastData.type === ServiceWorkerBroadcastType.STATUS
		) {
			const serviceWorkerStatusData: ServiceWorkerStatusData =
				broadcastData as ServiceWorkerStatusData;
			setStatus(serviceWorkerStatusData.value);
		}
	};
	useEffect(() => {
		if (status.finished && status.active && !status.paused) {
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
		setStatus({
			active: true,
			paused: false,
			finished: false,
		});
	};

	const pause = () => {
		const pauseCommand: ClientServiceWorkerCommandData = {
			type: ClientBroadcastType.SERVICE_WORKER_COMMAND,
			source: BROADCAST_SOURCE.CLIENT,
			target: BROADCAST_TARGET.SERVICE_WORKER,
			value: ServiceWorkerCommandValues.PAUSE,
		};
		broadcastChannel.postMessage(pauseCommand);
		setStatus({
			active: true,
			paused: true,
			finished: false,
		});
	};

	const stop = () => {
		const stopCommand: ClientServiceWorkerCommandData = {
			type: ClientBroadcastType.SERVICE_WORKER_COMMAND,
			source: BROADCAST_SOURCE.CLIENT,
			target: BROADCAST_TARGET.SERVICE_WORKER,
			value: ServiceWorkerCommandValues.STOP,
		};
		broadcastChannel.postMessage(stopCommand);
		setStatus({
			active: false,
			paused: false,
			finished: true,
		});
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
