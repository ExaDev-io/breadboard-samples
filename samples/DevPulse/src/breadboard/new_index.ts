import {
	HackerNewsAlgoliaKit,
	HackerNewsFirebaseKit,
	JsonKit,
	ListKit,
	ObjectKit,
	StringKit,
} from "@exadev/breadboard-kits/src";
import { Board, board, InputValues, OutputValues, Schema, code, base, NodeValue } from "@google-labs/breadboard";
import Core from "@google-labs/core-kit";
import { ClaudeKitBuilder, ClaudeParams } from "./ClaudeKitBuilder";
import { HackerNewAlgoliaSearchParameters, PostItem, SearchHits, Story } from "@exadev/breadboard-kits/src/kits/hackerNews/HackerNewsAlgoliaKit";
import { EmptyObject } from "@exadev/breadboard-kits/src/kits/ListKit";
import { limitDepth } from "@exadev/breadboard-kits/src/kits/ObjectKit";
import { postClaudeCompletion } from "@exadev/breadboard-kits/src/kits/ClaudeKit";
import { parametersFromTemplate, substitute } from "@exadev/breadboard-kits/src/kits/StringKit";

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
	const searchInProgress = base.output({
		$id: "searchInProgress",
		// schema: {
		// 	type: "object",
		// 	properties: {
		// 		partOne: { type: "string" },
		// 		partTwo: { type: "string" },
		// 		partThree: { type: "string" },
		// 	},
		// },
	});

	const searchParamsInput = base.input({
		$id: "searchParams",
		schema: searchParams
	});

	searchParamsInput.to(searchInProgress);

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

	searchParamsInput.query.to(search);
	searchParamsInput.limit.to(search);
	search.algoliaUrl.to(base.output({$id: "algoliaSearchUrl"}))

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
	})();

	search.hits.as("list").to(popSearchResult);
	popSearchResult.list.to(popSearchResult);

	const searchResult = code<{ inputs: InputValues & {object: Record<string, NodeValue>; }; }, OutputValues & { [key: string]: NodeValue; }>(async ({ inputs }) => {
		return Promise.resolve({
			...inputs.object,
		});
	})();

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
		code<{ inputs: InputValues & { template: string; } }, { string: string; }>(async ({ inputs }) => {
			const template = inputs.template;
			const parameters = parametersFromTemplate(template);
			
			if (!parameters.length) return { string: template };

			const substitutes = parameters.reduce((acc, parameter) => {
				if (inputs[parameter] === undefined)
					throw new Error(`Input is missing parameter "${parameter}"`);
				return { ...acc, [parameter]: inputs[parameter] };
			}, {});

			const string = substitute(template, substitutes);

			return Promise.resolve({ string });
		})().string.as("hnURL").to(searchResultOutput)
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
	})();

	if (TOP_STORIES) {
		// TODO this didn't seem to be passed anything in the original code either. Check again to confirm.
		code<{ inputs: InputValues & { limit?: number; } }, OutputValues & { storyIds: NodeValue & number[]; }>(async ({ inputs }) => {
			const url = "https://hacker-news.firebaseio.com/v0/topstories.json";
			const response = await fetch(url);
			const storyIds = (await response.json()) as number[];
			return {
				storyIds: inputs.limit ? storyIds.slice(0, inputs.limit) : storyIds,
			};
		})().storyIds.as("list").to(popStory);
	}
	popStory.wire("list", popStory);

	if (DEBUG) {
		popStory.item.as("id").to(base.output({
			$id: "storyId",
		}))
	}

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

    //////////////////////////////////////////////

    //////////////////////////////////////////////

	searchResult.story_id.as("id").to(getStoryFromId)
    
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

    //////////////////////////////////////////////

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

	getStoryFromId.to(nest)

	if (LIMIT_DEPTH) {
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

	getStoryFromId.story_id.to(
		base.output({
		$id: "templateText",
		instruction,
		templateText,
	}))

	const instructionTemplate = code<{ inputs: InputValues & { template: string; } }, { string: string; }>(async ({ inputs }) => {
		const template = inputs.template;
		const parameters = parametersFromTemplate(template);
		
		if (!parameters.length) return { string: template };

		const substitutes = parameters.reduce((acc, parameter) => {
			if (inputs[parameter] === undefined)
				throw new Error(`Input is missing parameter "${parameter}"`);
			return { ...acc, [parameter]: inputs[parameter] };
		}, {});

		const string = substitute(template, substitutes);

		return Promise.resolve({ string });
	})({
		$id: "instructionTemplate",
		template: templateText,
	})

	stringifiedPost.string.as("story").to(instructionTemplate)

	if (DEBUG) {
		instructionTemplate.string.to(base.output({
			$id: "populatedTemplate",
		}))
	}

	getStoryFromId.story_id.to(base.output({
		$id: "pendingOutput",
		summary: "pending",
	}))


	const claudePostSummarisation = code<{ input: InputValues }, OutputValues>(async ({ input }) => {
		return postClaudeCompletion(input as ClaudeParams);
	})({
		$id: "claudePostSummarisation",
		model: "claude-2",
		url: serverUrl,
	})

	searchParamsInput.claudeApiKey.as("apiKey").to(claudePostSummarisation)
	instructionTemplate.string.as("userQuestion").to(claudePostSummarisation)
	
	const summaryOutput = base.output({
		$id: "summary",
	});

	getStoryFromId.story_id.to(summaryOutput)
	claudePostSummarisation.completion.as("summary").to(summaryOutput);


    return summaryOutput;
});

const serializedBoard = myBoard.serialize({
	title: "DevPulse Board",
	description: "The description of my board.",
});

export { serializedBoard as board };
export { serializedBoard as default };