import { boardRunner } from "../../service-worker/sw";
import { SW_BROADCAST_CHANNEL } from "../constants";
import { BroadcastChannelMember } from "../types/BroadcastChannelMember";
import { BroadcastMessage } from "../types/BroadcastMessage";
import { BroadcastMessageType } from "../types/BroadcastMessageType";
import { RunnerState } from "../types/RunnerState";


export function SendStatus(id: BroadcastMessage["id"] = new Date().getTime().toString()) {
	const content: Omit<RunnerState, "pendingInputs"> & {
		pendingInputs: RunnerState["pendingInputs"]["requests"];
	} = {
		active: boardRunner?.state.active ?? false,
		paused: boardRunner?.state.paused ?? false,
		finished: boardRunner?.state.finished ?? false,
		pendingInputs: boardRunner.state.pendingInputs?.requests ?? {}
	};
	const response: BroadcastMessage = {
		id,
		messageType: BroadcastMessageType.STATUS,
		messageSource: BroadcastChannelMember.ServiceWorker,
		content: {
			timestamp: new Date(),
			...content
		},
	};
	new BroadcastChannel(SW_BROADCAST_CHANNEL).postMessage(response);
}

export default SendStatus;