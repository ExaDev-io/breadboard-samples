import { Board } from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";
import test, { ExecutionContext } from "ava";
import ListKit from "../../src/kits/ListKit.js";
import HackerNewsAlgoliaKit, {
	Story,
	search,
} from "../../src/kits/hackerNews/HackerNewsAlgoliaKit.js";
import HackerNewsFirebaseKit from "../../src/kits/hackerNews/HackerNewsFirebaseKit.js";

test("hackernews algolia get story by id", async (t: ExecutionContext) => {
	const board = new Board();
	const firebase = board.addKit(HackerNewsFirebaseKit);
	const algolia = board.addKit(HackerNewsAlgoliaKit);
	const output = board.output();
	const listKit = board.addKit(ListKit);
	const pop = listKit.pop();

	const topStoryIdNode = firebase.topStoryIds({
		limit: 2,
	});

	const getStoryFromId = algolia.getStory();
	topStoryIdNode.wire("storyIds->list", pop);
	pop.wire("->list", pop);
	pop.wire("item->id", getStoryFromId);
	getStoryFromId.wire("*", output);

	for await (const result of board.run({})) {
		if (result.outputs && result.outputs.story_id) {
			const story = result.outputs as unknown as Story;
			t.assert(story, `story ${story.url}`);
			t.assert(story.title, "story.title");
		}
		if (result.outputs.error) {
			console.error(result.outputs.error);
		}
	}
});

test("Get specific story attributes", async (t: ExecutionContext) => {
	const board = new Board();
	const firebase = board.addKit(HackerNewsFirebaseKit);
	const algolia = board.addKit(HackerNewsAlgoliaKit);
	const listKit = board.addKit(ListKit);

	const pop = listKit.pop();

	const topStoryIdNode = firebase.topStoryIds({
		limit: 2,
	});

	const getStoryFromId = algolia.getStory();
	topStoryIdNode.wire("storyIds->list", pop);
	pop.wire("->list", pop);
	pop.wire("item->id", getStoryFromId);

	const core = board.addKit(Core);

	const aggregate = core.passthrough();

	getStoryFromId.wire("->algoliaUrl", aggregate);
	getStoryFromId.wire("->story_id", aggregate);
	getStoryFromId.wire("->url", aggregate);
	getStoryFromId.wire("->title", aggregate);

	aggregate.wire("*", board.output());

	for await (const result of board.run({})) {
		if (result.outputs) {
			type storyPartial = {
				algoliaUrl: string;
				story_id: number;
				url: string;
				title: string;
			};

			const expectedNumberOfKeys: number = Object.keys(
				{} as storyPartial
			).length;

			const story: storyPartial = Object.assign(
				{},
				result.outputs
			) as unknown as storyPartial;

			const actualNumberOfKeys: number = Object.keys(story).length;
			t.notDeepEqual(
				actualNumberOfKeys,
				expectedNumberOfKeys,
				"expected number of keys"
			);

			for (const [key, value] of Object.entries(story)) {
				t.truthy(value, `outputs.${key}`);
			}
		}
	}
});

test("search function forms correct URL with all parameters", async (t) => {
	const result = await search({
		query: "JavaScript",
	});

	const algoliaUrl = result.algoliaUrl;
	const expectedUrl = "https://hn.algolia.com/api/v1/search?query=JavaScript";
	t.is(algoliaUrl, expectedUrl);

	const hits = result.hits;
	t.assert(hits, "hits");
	t.assert(hits.length > 0, "hits.length");
	console.log(result);
});

test("search function handles absence of optional parameters gracefully", async (t) => {
	const params = { query: "Python" };
	const result = await search(params);

	const expectedUrl = "https://hn.algolia.com/api/v1/search?query=Python";
	t.is(result.algoliaUrl, expectedUrl);
});

test("search function handles tags parameter", async (t) => {
	const result = await search({
		query: "JavaScript",
		tags: ["story"],
	});

	const expectedUrl =
		"https://hn.algolia.com/api/v1/search?query=JavaScript&tags=story";
	t.is(result.algoliaUrl, expectedUrl);
});

test("search function handles numericFilters parameter", async (t) => {
	const result = await search({
		query: "JavaScript",
		numericFilters: [
			{
				field: "points",
				operator: ">",
				value: 100,
			},
		],
	});

	const expectedUrl =
		"https://hn.algolia.com/api/v1/search?query=JavaScript&numericFilters=points%3E100";
	t.is(result.algoliaUrl, expectedUrl);
});

test("search function handles page parameter", async (t) => {
	const result = await search({
		query: "JavaScript",
		page: 2,
	});

	const expectedUrl =
		"https://hn.algolia.com/api/v1/search?query=JavaScript&page=2";
	t.is(result.algoliaUrl, expectedUrl);
});

test("search function handles all parameters", async (t) => {
	const result = await search({
		query: "JavaScript",
		tags: ["story"],
		numericFilters: [
			{
				field: "points",
				operator: ">",
				value: 100,
			},
		],
		page: 2,
	});

	const expectedUrl =
		"https://hn.algolia.com/api/v1/search?query=JavaScript&tags=story&numericFilters=points%3E100&page=2";
	t.is(result.algoliaUrl, expectedUrl);
});

test("search function returns hits", async (t) => {
	const result = await search({
		query: "JavaScript",
	});

	const hits = result.hits;
	t.assert(hits, "hits");
	t.assert(hits.length > 0, "hits.length");
});
