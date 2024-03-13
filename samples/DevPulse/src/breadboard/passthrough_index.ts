import { board, InputValues, OutputValues, Schema, code, base, NodeValue, addKit } from "@google-labs/breadboard";
import { ClaudeKitBuilder, ClaudeParams } from "./ClaudeKitBuilder";
import { HackerNewAlgoliaSearchParameters, PostItem, SearchHits, Story } from "@exadev/breadboard-kits/src/kits/hackerNews/HackerNewsAlgoliaKit";
import { EmptyObject } from "@exadev/breadboard-kits/src/kits/ListKit";
import { limitDepth } from "@exadev/breadboard-kits/src/kits/ObjectKit";
import { postClaudeCompletion } from "@exadev/breadboard-kits/src/kits/ClaudeKit";
import { StringKit } from "./kits/StringKit";
import Core from "@google-labs/core-kit";
// import { parametersFromTemplate, substitute } from "@exadev/breadboard-kits/src/kits/StringKit";

const core = addKit(Core);
const stringKit = addKit(StringKit)

const LIMIT_DEPTH = 3;
const SEARCH_RESULT_COUNT = 10;

const DEBUG = false;
const TOP_STORIES = false;

//////////////////////////////////////////////
const query: Schema = {
	title: "Please enter a search query",
	type: "string",
}
const limit: Schema = {
	title: "Please enter the number of results to return",
	type: "number",
	default: SEARCH_RESULT_COUNT.toString(),
}
const claudeApiKeySchema: Schema = {
	title: "Please enter your API Key",
	type: "password",
}
//////////////////////////////////////////////
const searchParams: Schema = {
	type: "object",
	properties: {
		query,
		limit,
		claudeApiKey: claudeApiKeySchema
	},
} satisfies Schema;
//////////////////////////////////////////////

const myBoard = board(() => {
	const search = code<{ inputs: InputValues & HackerNewAlgoliaSearchParameters; }, { algoliaUrl: string, hits: PostItem[] } >(async ({ inputs }) => {
		const { query, tags, numericFilters, page } = inputs;
		const url = new URL("https://hn.algolia.com/api/v1/search");
		url.searchParams.set("query", query);
		if (tags) {
			url.searchParams.set("tags", tags.join(","));
		}
		if (numericFilters) {
			url.searchParams.set(
				"numericFilters",
				numericFilters
					.map((filter) => {
						return `${filter.field}${filter.operator}${filter.value}`;
					})
					.join(",")
			);
		}
		if (page) {
			url.searchParams.set("page", page.toString());
		}
		const response = await fetch(url.href);
		const { hits } = (await response.json()) as unknown as {
			hits: PostItem[];
		};
		return Promise.resolve({
			algoliaUrl: url.href,
			hits: inputs.limit ? hits.slice(0, inputs.limit) : hits,
		});
	})();

	const searchInProgress = base.output({ $id: "searchInProgress" });

	const searchParamsInput = base.input({ $id: "searchParams", schema: searchParams });
	const searchParamPassthrough = core.passthrough();
	searchParamsInput.to(searchParamPassthrough);

	searchParamPassthrough.to(searchInProgress);

	searchParamPassthrough.query.to(search);
	searchParamPassthrough.limit.to(search);
	
	search.algoliaUrl.to(base.output({$id: "algoliaSearchUrl"}))

	const claudeApiKey = core.passthrough();
	searchParamPassthrough.wire("claudeApiKey", claudeApiKey);

    //////////////////////////////////////////////
	if (DEBUG) {
		search.hits.to(base.output({$id: "searchResults"}))
	}

	const popSearchResult = code<{ inputs: InputValues; }, OutputValues & (EmptyObject | {
		item: NodeValue;
		list: NodeValue[];
	})>(async ({ inputs }) => {
		if (
			!inputs.list ||
			!Array.isArray(inputs.list) ||
			(Array.isArray(inputs.list) && inputs.list.length == 0)
		) {
			return {};
		}
		const list: NodeValue[] = inputs.list as NodeValue[];
		const item: NodeValue = list.pop();
		return Promise.resolve({ item, list });
	})({ $id: "popSearchResult" });

	search.hits.as("list").to(popSearchResult);
	popSearchResult.list.to(popSearchResult);
	const searchResult = code<{ inputs: InputValues & {object: Record<string, NodeValue>; }; }, OutputValues & { [key: string]: NodeValue; }>(async ({ inputs }) => {
		return Promise.resolve({
			...inputs.object,
		});
	})({ $id: "searchResult" });
	popSearchResult.item.as("object").to(searchResult)
	const searchResultOutput = base.output({
		$id: "searchResultData",
	});
	searchResult.story_id.to(searchResultOutput);
	searchResult.title.to(searchResultOutput);
	searchResult.url.to(searchResultOutput);
	searchResult.author.to(searchResultOutput);
	searchResult.created_at.to(searchResultOutput);
	searchResult.created_at_i.to(searchResultOutput);
	searchResult.points.to(searchResultOutput);
	searchResult.story_id.to(
		stringKit.templateA({ 
			template: "https://news.ycombinator.com/item?id={{story_id}}" // <--- not working when passed in (property undefined)
		}).string.as("hnURL").to(searchResultOutput)
	);

    //////////////////////////////////////////////

	const popStory = code<{ inputs: InputValues; }, OutputValues & (EmptyObject | {
		item: NodeValue;
		list: NodeValue[];
	})>(async ({ inputs }) => {
		if (
			!inputs.list ||
			!Array.isArray(inputs.list) ||
			(Array.isArray(inputs.list) && inputs.list.length == 0)
		) {
			return {};
		}
		const list: NodeValue[] = inputs.list as NodeValue[];
		const item: NodeValue = list.pop();
		return Promise.resolve({ item, list });
	})({ $id: "popStoryId" });

	if (TOP_STORIES) {
		const hackerNewsTopStoryIdList = core.passthrough();
		code<{ inputs: InputValues & { limit?: number; } }, OutputValues & { storyIds: NodeValue & number[]; }>(async ({ inputs }) => {
			const url = "https://hacker-news.firebaseio.com/v0/topstories.json";
			const response = await fetch(url);
			const storyIds = (await response.json()) as number[];
			return {
				storyIds: inputs.limit ? storyIds.slice(0, inputs.limit) : storyIds,
			};
		})({ limit: 1 }).storyIds.to(hackerNewsTopStoryIdList);
		hackerNewsTopStoryIdList.storyIds.as("list").to(popStory)
	}
	popStory.list.to(popStory);
	const storyId = core.passthrough();
	popStory.item.as("id").to(storyId);

	if (DEBUG) {
		storyId.id.to(base.output({
			$id: "storyId",
		}))
	}

	//////////////////////////////////////////////
	searchResult.story_id.as("id").to(storyId);
	//////////////////////////////////////////////

	// const hnAlgoliaKit = addKit(HackerNewsAlgoliaKit);
	// using code node instead of kit

	const getStoryFromId = code<{ inputs: InputValues; }, OutputValues & Story>(async ({ inputs }) => {
		const id: string = inputs.id as string;
		const url = `https://hn.algolia.com/api/v1/items/${id}`;
		// return {url}
		const response = await fetch(url);
		const story: Story = (await response.json()) as unknown as Story;
		return Promise.resolve({
			algoliaUrl: url,
			...story,
		});
	})();

	storyId.id.to(getStoryFromId);
	const story = core.passthrough();

	getStoryFromId.to(story);
	if (DEBUG) {
		getStoryFromId.to(
			base.output({
				$id: "fullStory",
			})
		)
	}

	const storyOutput = base.output({
		$id: "story",
	});

	getStoryFromId.algoliaUrl.to(storyOutput)
	getStoryFromId.author.to(storyOutput)
	getStoryFromId.created_at.to(storyOutput)
	getStoryFromId.created_at_i.to(storyOutput)
	getStoryFromId.points.to(storyOutput)
	getStoryFromId.story_id.to(storyOutput)
	getStoryFromId.title.to(storyOutput)
	getStoryFromId.type.to(storyOutput)
	getStoryFromId.url.to(storyOutput)
	search.algoliaUrl.to(storyOutput)

	if (DEBUG) {
		getStoryFromId.children.to(storyOutput);
	}
    
    //////////////////////////////////////////////

    //////////////////////////////////////////////


    const VITE_SERVER_PORT = 5173;
    const fallback = `http://localhost:${VITE_SERVER_PORT}`;
    let serverUrl = `${fallback}/anthropic/v1/complete`;

	if (typeof process !== "undefined" && process.release.name === "node") {
		console.log("Running in node");
		serverUrl = `${fallback}/anthropic/v1/complete`;
	}

    //////////////////////////////////////////////

	// const jsonKit = addKit(JsonKit);
	// using code node instead of kit
	const stringifiedPost = code<{ inputs: InputValues & { object: string; } }, OutputValues>(async ({ inputs }) => {
		const { object } = inputs;
		return Promise.resolve({
			string: JSON.stringify(object),
		});
	})();

	const nest = code<{ inputs: InputValues & { key: string; } }, OutputValues>(async ({ inputs }) => {
		const { key, ...rest } = inputs;
		return Promise.resolve({
			[key]: rest,
		});
	})({ key: "story" });

	story.to(nest)

	if (LIMIT_DEPTH) {
		// const objectKit = addKit(ObjectKit);
		// using code node instead of kit
		const limit = code<{ inputs: InputValues & {
			object: Record<string, NodeValue>;
			depth: number;
		} }, OutputValues & { object: Record<string, NodeValue>; }>(async ({ inputs }) => {
			const { object, depth } = inputs;
			return Promise.resolve({
				object: limitDepth(object, depth),
			});
		})({ depth: LIMIT_DEPTH });
		nest.story.as("object").to(limit);
		limit.object.to(stringifiedPost)
	} else {
		getStoryFromId.story.as("object").to(stringifiedPost)
	}
	if (DEBUG) {
		stringifiedPost.string.to(base.output({$id: "json"}))
	}

    //////////////////////////////////////////////

    const instruction = "Summarise the discussion regarding this post";
    const templateText = [instruction, "```json", "{{story}}", "```"].join("\n");

	story.story_id.to(
		base.output({
			$id: "templateText",
			instruction,
			templateText,
	}))

	const instructionTemplate = stringKit.templateB({
		$id: "instructionTemplate",
		// template: templateText, // <--- not working when passed in (property undefined)
	})
	stringifiedPost.string.as("story").to(instructionTemplate)

	if (DEBUG) {
		instructionTemplate.string.to(
			base.output({
				$id: "populatedTemplate",
		}))
	}

	story.story_id.to(
		base.output({
			$id: "pendingOutput",
			summary: "pending",
	}))


	const claudePostSummarisation = code<{ input: InputValues }, OutputValues>(async ({ input }) => {
		return postClaudeCompletion(input as ClaudeParams);
	})({
		$id: "claudePostSummarisation",
		model: "claude-2",
		url: serverUrl,
	});

	claudeApiKey.claudeApiKey.as("apiKey").to(claudePostSummarisation)
	instructionTemplate.string.as("userQuestion").to(claudePostSummarisation)
	
	const summaryOutput = base.output({
		$id: "summary",
	});

	story.story_id.to(summaryOutput)
	claudePostSummarisation.completion.as("summary").to(summaryOutput);

    return summaryOutput;
});

const serializedBoard = myBoard.serialize({
	title: "DevPulse Board",
	description: "The description of my board.",
});

export { serializedBoard as board };
export { serializedBoard as default };