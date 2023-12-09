import { EntityState } from "@reduxjs/toolkit";
import { StoryOutput } from "~/hnStory/domain";
import { WorkerData } from "~/sw/types";

export type InputState = EntityState<WorkerData, string>;
export type OutputState = EntityState<StoryOutput, string>;
