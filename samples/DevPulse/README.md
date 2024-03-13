# DevPulse

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
searchParams[/"input <br> id='searchParams'"/]:::input -- all --> passthrough2(("passthrough <br> id='passthrough-2'")):::passthrough
passthrough2(("passthrough <br> id='passthrough-2'")):::passthrough --> searchInProgress{{"output <br> id='searchInProgress'"}}:::output
passthrough2(("passthrough <br> id='passthrough-2'")):::passthrough -- "query->query" --> search1["search <br> id='search-1'"]
passthrough2(("passthrough <br> id='passthrough-2'")):::passthrough -- "limit->limit" --> search1["search <br> id='search-1'"]
search1["search <br> id='search-1'"] -- "algoliaUrl->algoliaUrl" --> algoliaSearchUrl{{"output <br> id='algoliaSearchUrl'"}}:::output
passthrough2(("passthrough <br> id='passthrough-2'")):::passthrough -- "claudeApiKey->claudeApiKey" --> passthrough3(("passthrough <br> id='passthrough-3'")):::passthrough
search1["search <br> id='search-1'"] -- "hits->list" --> popSearchResult["pop <br> id='popSearchResult'"]
popSearchResult["pop <br> id='popSearchResult'"] -- "list->list" --> popSearchResult["pop <br> id='popSearchResult'"]
popSearchResult["pop <br> id='popSearchResult'"] -- "item->object" --> searchResult["spread <br> id='searchResult'"]
searchResult["spread <br> id='searchResult'"] -- "story_id->story_id" --> searchResultData{{"output <br> id='searchResultData'"}}:::output
searchResult["spread <br> id='searchResult'"] -- "title->title" --> searchResultData{{"output <br> id='searchResultData'"}}:::output
searchResult["spread <br> id='searchResult'"] -- "url->url" --> searchResultData{{"output <br> id='searchResultData'"}}:::output
searchResult["spread <br> id='searchResult'"] -- "author->author" --> searchResultData{{"output <br> id='searchResultData'"}}:::output
searchResult["spread <br> id='searchResult'"] -- "created_at->created_at" --> searchResultData{{"output <br> id='searchResultData'"}}:::output
searchResult["spread <br> id='searchResult'"] -- "created_at_i->created_at_i" --> searchResultData{{"output <br> id='searchResultData'"}}:::output
searchResult["spread <br> id='searchResult'"] -- "points->points" --> searchResultData{{"output <br> id='searchResultData'"}}:::output
template4["template <br> id='template-4'"] -- "string->hnURL" --> searchResultData{{"output <br> id='searchResultData'"}}:::output
searchResult["spread <br> id='searchResult'"] -- "story_id->story_id" --> template4["template <br> id='template-4'"]
popStoryId["pop <br> id='popStoryId'"] -- "list->list" --> popStoryId["pop <br> id='popStoryId'"]
popStoryId["pop <br> id='popStoryId'"] -- "item->id" --> passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough
searchResult["spread <br> id='searchResult'"] -- "story_id->id" --> passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough
passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough -- "id->id" --> getStory6["getStory <br> id='getStory-6'"]
getStory6["getStory <br> id='getStory-6'"] -- all --> passthrough7(("passthrough <br> id='passthrough-7'")):::passthrough
passthrough7(("passthrough <br> id='passthrough-7'")):::passthrough -- "algoliaUrl->algoliaUrl" --> story{{"output <br> id='story'"}}:::output
passthrough7(("passthrough <br> id='passthrough-7'")):::passthrough -- "author->author" --> story{{"output <br> id='story'"}}:::output
passthrough7(("passthrough <br> id='passthrough-7'")):::passthrough -- "created_at->created_at" --> story{{"output <br> id='story'"}}:::output
passthrough7(("passthrough <br> id='passthrough-7'")):::passthrough -- "created_at_i->created_at_i" --> story{{"output <br> id='story'"}}:::output
passthrough7(("passthrough <br> id='passthrough-7'")):::passthrough -- "points->points" --> story{{"output <br> id='story'"}}:::output
passthrough7(("passthrough <br> id='passthrough-7'")):::passthrough -- "story_id->story_id" --> story{{"output <br> id='story'"}}:::output
passthrough7(("passthrough <br> id='passthrough-7'")):::passthrough -- "title->title" --> story{{"output <br> id='story'"}}:::output
passthrough7(("passthrough <br> id='passthrough-7'")):::passthrough -- "type->type" --> story{{"output <br> id='story'"}}:::output
passthrough7(("passthrough <br> id='passthrough-7'")):::passthrough -- "url->url" --> story{{"output <br> id='story'"}}:::output
search1["search <br> id='search-1'"] -- "algoliaUrl->algoliaUrl" --> story{{"output <br> id='story'"}}:::output
passthrough7(("passthrough <br> id='passthrough-7'")):::passthrough -- all --> nest9["nest <br> id='nest-9'"]
nest9["nest <br> id='nest-9'"] -- "story->object" --> limitDepth10["limitDepth <br> id='limitDepth-10'"]
limitDepth10["limitDepth <br> id='limitDepth-10'"] -- "object->object" --> stringify8["stringify <br> id='stringify-8'"]
passthrough7(("passthrough <br> id='passthrough-7'")):::passthrough -- "story_id->story_id" --> templateText{{"output <br> id='templateText'"}}:::output
stringify8["stringify <br> id='stringify-8'"] -- "string->story" --> instructionTemplate["template <br> id='instructionTemplate'"]
passthrough7(("passthrough <br> id='passthrough-7'")):::passthrough -- "story_id->story_id" --> pendingOutput{{"output <br> id='pendingOutput'"}}:::output
passthrough3(("passthrough <br> id='passthrough-3'")):::passthrough -- "claudeApiKey->apiKey" --> claudePostSummarisation["complete <br> id='claudePostSummarisation'"]
instructionTemplate["template <br> id='instructionTemplate'"] -- "string->userQuestion" --> claudePostSummarisation["complete <br> id='claudePostSummarisation'"]
passthrough7(("passthrough <br> id='passthrough-7'")):::passthrough -- "story_id->story_id" --> summary{{"output <br> id='summary'"}}:::output
claudePostSummarisation["complete <br> id='claudePostSummarisation'"] -- "completion->summary" --> summary{{"output <br> id='summary'"}}:::output
classDef default stroke:#ffab40,fill:#fff2ccff,color:#000
classDef input stroke:#3c78d8,fill:#c9daf8ff,color:#000
classDef output stroke:#38761d,fill:#b6d7a8ff,color:#000
classDef passthrough stroke:#a64d79,fill:#ead1dcff,color:#000
classDef slot stroke:#a64d79,fill:#ead1dcff,color:#000
classDef config stroke:#a64d79,fill:#ead1dcff,color:#000
classDef secrets stroke:#db4437,fill:#f4cccc,color:#000
classDef slotted stroke:#a64d79
```

```json
{
	"title": "DevPulse",
	"$schema": "https://raw.githubusercontent.com/breadboard-ai/breadboard/@google-labs/breadboard-schema@1.3.0/packages/schema/breadboard.schema.json",
	"edges": [
		{
			"from": "searchParams",
			"to": "passthrough-2",
			"out": "*"
		},
		{
			"from": "passthrough-2",
			"to": "searchInProgress"
		},
		{
			"from": "passthrough-2",
			"to": "search-1",
			"out": "query",
			"in": "query"
		},
		{
			"from": "passthrough-2",
			"to": "search-1",
			"out": "limit",
			"in": "limit"
		},
		{
			"from": "search-1",
			"to": "algoliaSearchUrl",
			"out": "algoliaUrl",
			"in": "algoliaUrl"
		},
		{
			"from": "passthrough-2",
			"to": "passthrough-3",
			"out": "claudeApiKey",
			"in": "claudeApiKey"
		},
		{
			"from": "search-1",
			"to": "popSearchResult",
			"out": "hits",
			"in": "list"
		},
		{
			"from": "popSearchResult",
			"to": "popSearchResult",
			"out": "list",
			"in": "list"
		},
		{
			"from": "popSearchResult",
			"to": "searchResult",
			"out": "item",
			"in": "object"
		},
		{
			"from": "searchResult",
			"to": "searchResultData",
			"out": "story_id",
			"in": "story_id"
		},
		{
			"from": "searchResult",
			"to": "searchResultData",
			"out": "title",
			"in": "title"
		},
		{
			"from": "searchResult",
			"to": "searchResultData",
			"out": "url",
			"in": "url"
		},
		{
			"from": "searchResult",
			"to": "searchResultData",
			"out": "author",
			"in": "author"
		},
		{
			"from": "searchResult",
			"to": "searchResultData",
			"out": "created_at",
			"in": "created_at"
		},
		{
			"from": "searchResult",
			"to": "searchResultData",
			"out": "created_at_i",
			"in": "created_at_i"
		},
		{
			"from": "searchResult",
			"to": "searchResultData",
			"out": "points",
			"in": "points"
		},
		{
			"from": "template-4",
			"to": "searchResultData",
			"out": "string",
			"in": "hnURL"
		},
		{
			"from": "searchResult",
			"to": "template-4",
			"out": "story_id",
			"in": "story_id"
		},
		{
			"from": "popStoryId",
			"to": "popStoryId",
			"out": "list",
			"in": "list"
		},
		{
			"from": "popStoryId",
			"to": "passthrough-5",
			"out": "item",
			"in": "id"
		},
		{
			"from": "searchResult",
			"to": "passthrough-5",
			"out": "story_id",
			"in": "id"
		},
		{
			"from": "passthrough-5",
			"to": "getStory-6",
			"out": "id",
			"in": "id"
		},
		{
			"from": "getStory-6",
			"to": "passthrough-7",
			"out": "*"
		},
		{
			"from": "passthrough-7",
			"to": "story",
			"out": "algoliaUrl",
			"in": "algoliaUrl"
		},
		{
			"from": "passthrough-7",
			"to": "story",
			"out": "author",
			"in": "author"
		},
		{
			"from": "passthrough-7",
			"to": "story",
			"out": "created_at",
			"in": "created_at"
		},
		{
			"from": "passthrough-7",
			"to": "story",
			"out": "created_at_i",
			"in": "created_at_i"
		},
		{
			"from": "passthrough-7",
			"to": "story",
			"out": "points",
			"in": "points"
		},
		{
			"from": "passthrough-7",
			"to": "story",
			"out": "story_id",
			"in": "story_id"
		},
		{
			"from": "passthrough-7",
			"to": "story",
			"out": "title",
			"in": "title"
		},
		{
			"from": "passthrough-7",
			"to": "story",
			"out": "type",
			"in": "type"
		},
		{
			"from": "passthrough-7",
			"to": "story",
			"out": "url",
			"in": "url"
		},
		{
			"from": "search-1",
			"to": "story",
			"out": "algoliaUrl",
			"in": "algoliaUrl"
		},
		{
			"from": "passthrough-7",
			"to": "nest-9",
			"out": "*"
		},
		{
			"from": "nest-9",
			"to": "limitDepth-10",
			"out": "story",
			"in": "object"
		},
		{
			"from": "limitDepth-10",
			"to": "stringify-8",
			"out": "object",
			"in": "object"
		},
		{
			"from": "passthrough-7",
			"to": "templateText",
			"out": "story_id",
			"in": "story_id"
		},
		{
			"from": "stringify-8",
			"to": "instructionTemplate",
			"out": "string",
			"in": "story"
		},
		{
			"from": "passthrough-7",
			"to": "pendingOutput",
			"out": "story_id",
			"in": "story_id"
		},
		{
			"from": "passthrough-3",
			"to": "claudePostSummarisation",
			"out": "claudeApiKey",
			"in": "apiKey"
		},
		{
			"from": "instructionTemplate",
			"to": "claudePostSummarisation",
			"out": "string",
			"in": "userQuestion"
		},
		{
			"from": "passthrough-7",
			"to": "summary",
			"out": "story_id",
			"in": "story_id"
		},
		{
			"from": "claudePostSummarisation",
			"to": "summary",
			"out": "completion",
			"in": "summary"
		}
	],
	"nodes": [
		{
			"id": "search-1",
			"type": "search",
			"configuration": {
				"tags": [
					"story"
				],
				"limit": 10
			}
		},
		{
			"id": "searchInProgress",
			"type": "output"
		},
		{
			"id": "searchParams",
			"type": "input",
			"configuration": {
				"schema": {
					"type": "object",
					"properties": {
						"query": {
							"title": "Please enter a search query",
							"type": "string"
						},
						"limit": {
							"title": "Please enter the number of results to return",
							"type": "number",
							"default": "10"
						},
						"claudeApiKey": {
							"title": "Please enter your API Key",
							"type": "password"
						}
					}
				}
			}
		},
		{
			"id": "passthrough-2",
			"type": "passthrough"
		},
		{
			"id": "algoliaSearchUrl",
			"type": "output"
		},
		{
			"id": "passthrough-3",
			"type": "passthrough"
		},
		{
			"id": "popSearchResult",
			"type": "pop"
		},
		{
			"id": "searchResult",
			"type": "spread"
		},
		{
			"id": "searchResultData",
			"type": "output"
		},
		{
			"id": "template-4",
			"type": "template",
			"configuration": {
				"template": "https://news.ycombinator.com/item?id={{story_id}}"
			}
		},
		{
			"id": "popStoryId",
			"type": "pop"
		},
		{
			"id": "passthrough-5",
			"type": "passthrough"
		},
		{
			"id": "getStory-6",
			"type": "getStory"
		},
		{
			"id": "passthrough-7",
			"type": "passthrough"
		},
		{
			"id": "story",
			"type": "output"
		},
		{
			"id": "stringify-8",
			"type": "stringify"
		},
		{
			"id": "nest-9",
			"type": "nest",
			"configuration": {
				"key": "story"
			}
		},
		{
			"id": "limitDepth-10",
			"type": "limitDepth",
			"configuration": {
				"depth": 3
			}
		},
		{
			"id": "templateText",
			"type": "output",
			"configuration": {
				"instruction": "Summarise the discussion regarding this post",
				"templateText": "Summarise the discussion regarding this post\n```json\n{{story}}\n```"
			}
		},
		{
			"id": "instructionTemplate",
			"type": "template",
			"configuration": {
				"template": "Summarise the discussion regarding this post\n```json\n{{story}}\n```"
			}
		},
		{
			"id": "pendingOutput",
			"type": "output",
			"configuration": {
				"summary": "pending"
			}
		},
		{
			"id": "claudePostSummarisation",
			"type": "complete",
			"configuration": {
				"model": "claude-2",
				"url": "http://localhost:5173/anthropic/v1/complete"
			}
		},
		{
			"id": "summary",
			"type": "output"
		}
	],
	"kits": [
		{
			"url": "npm:@exadev/breadboard-kits/HackerNewsFirebaseKit"
		},
		{
			"url": "npm:@exadev/breadboard-kits/HackerNewsAlgoliaKit"
		},
		{
			"title": "Core Kit",
			"url": "npm:@google-labs/core-kit"
		},
		{
			"url": "npm:@exadev/breadboard-kits/list"
		},
		{
			"url": "npm:@exadev/breadboard-kits"
		},
		{
			"url": "npm:@exadev/breadboard-kits/kits/ObjectKit"
		},
		{
			"url": "npm:@exadev/breadboard-kits/kits/StringKit"
		},
		{
			"url": "npm:@exadev/breadboard-kits/HackerNewsAlgoliaKit"
		},
		{
			"url": "npm:@exadev/breadboard-kits/kits/JsonKit"
		},
		{
			"url": "npm:@exadev/breadboard-kits/kits/ObjectKit"
		}
	]
}
```