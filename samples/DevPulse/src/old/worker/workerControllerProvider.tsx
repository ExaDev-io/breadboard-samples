import React, { ReactNode, useEffect } from "react";
import useWorkerController from "~/old/worker/useWorkerController";
import { WorkerControllerContext } from "~/old/worker/workerControllerContext";
import { SW_BROADCAST_CHANNEL } from "../../lib/constants";

export function WorkerControllerProvider({
	broadcastChannel,
	children,
}: {
	broadcastChannel?: string;
	children: ReactNode;
}): React.JSX.Element {
	const bc = useWorkerController(
		new BroadcastChannel(broadcastChannel ?? SW_BROADCAST_CHANNEL)
	);
	useEffect(() => {}, []);
	return (
		<WorkerControllerContext.Provider
			value={{ broadcastChannel: bc, workerSteps: bc.workerSteps }}
		>
			{children}
		</WorkerControllerContext.Provider>
	);
}
