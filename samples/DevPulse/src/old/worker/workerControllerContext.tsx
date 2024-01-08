import React from "react";
import useWorkerSteps from "~/hnStory/components/useWorkerSteps";
import { WorkerControllerHook } from "~/old/worker/useWorkerController";

export const WorkerControllerContext = React.createContext<{
	broadcastChannel: WorkerControllerHook;
	workerSteps: ReturnType<typeof useWorkerSteps>;
} | null>(null);
