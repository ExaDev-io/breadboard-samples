import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "~/core/redux/store";
import { StoryOutput } from "./domain";

export const WorkerStatus = {
	idle: "idle",
	running: "running",
	paused: "paused",
	stopped: "stopped",
	loading: "loading",
	finished: "finished",
} as const;

const initialState = {
	output: [] as StoryOutput[],
	savedResults: [] as StoryOutput[],
	status: WorkerStatus,
};

const outputSlice = createSlice({
	name: "output",
	initialState: initialState,
	reducers: {
		setOutput: (state, action) => {
			state.output = action.payload;
		},
		saveResult: (state, action) => {
			state.savedResults = action.payload;
		},
		reset: () => initialState,
	},
});

export const selectOutput = (state: RootState) => state.output.output;
export const selectSavedResults = (state: RootState) =>
	state.output.savedResults;
export const { setOutput, saveResult, reset } = outputSlice.actions;
export default outputSlice.reducer;
