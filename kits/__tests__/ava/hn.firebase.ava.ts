import { Board, LogProbe } from "@google-labs/breadboard";
import test, { ExecutionContext } from "ava";
import ListKit from "../../src/kits/ListKit.js";
import HackerNewsFirebaseKit, {
	HNFirebaseStoryData,
} from "../../src/kits/hackerNews/HackerNewsFirebaseKit.js";

test("hnFirebaseKit.topStoryIds", async (t: ExecutionContext) => {
	const board = new Board();
	const kit = board.addKit(HackerNewsFirebaseKit);

	const output = board.output();
	kit.topStoryIds().wire("storyIds->", output);
	for await (const result of board.run({
		probe: new LogProbe(),
	})) {
		if (result.outputs && result.outputs.storyIds) {
			const storyIds = result.outputs.storyIds as number[];
			t.is(Array.isArray(storyIds), true);
			// the number of stories varies, so we can't assert it against a certain number
			t.is(true, storyIds.length > 1);
		}
	}
});
//
test("hnFirebaseKit.topStoryIds limited", async (t) => {
	const board = new Board();
	const kit = board.addKit(HackerNewsFirebaseKit);

	const output = board.output();
	kit.topStoryIds({ limit: 10 }).wire("storyIds->", output);
	for await (const result of board.run({
		probe: new LogProbe(),
	})) {
		if (result.outputs && result.outputs.storyIds) {
			const stories = result.outputs.storyIds as number[];
			t.is(Array.isArray(stories), true);
			t.is(stories.length, 10);
		}
	}
});

test("hnFirebaseKit.getStoryFromId", async (t) => {
	const board = new Board();
	const hnKit = board.addKit(HackerNewsFirebaseKit);
	const listKit = board.addKit(ListKit);
	const pop = listKit.pop();
	const getStoryFromId = hnKit.getStoryFromId();

	const output = board.output();
	const input = board.input();
	const topStoryIdNode = hnKit.topStoryIds();

	input.wire("limit", topStoryIdNode);
	topStoryIdNode.wire("storyIds->list", pop);
	pop.wire("->list", pop);
	pop.wire("item->id", getStoryFromId.wire("*", output));

	const limit = 10;
	const accumulatedResult = [];

	for await (const result of board.run({
		probe: new LogProbe(),
	})) {
		if (result.type === "input") {
			result.inputs = {
				limit,
			};
		} else if (result.type === "output") {
			const item: HNFirebaseStoryData = result.outputs
				.output as HNFirebaseStoryData;
			accumulatedResult.push({ item });
		}
	}
	t.is(accumulatedResult.length, limit);
});
