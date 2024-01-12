# DevPulse

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
searchParams[/"input <br> id='searchParams'"/]:::input -- "query->query" --> search1["search <br> id='search-1'"]
searchParams[/"input <br> id='searchParams'"/]:::input -- "query->query" --> searchInProgress{{"output <br> id='searchInProgress'"}}:::output
searchParams[/"input <br> id='searchParams'"/]:::input -- "limit->limit" --> search1["search <br> id='search-1'"]
searchParams[/"input <br> id='searchParams'"/]:::input -- "query->query" --> searchInProgress{{"output <br> id='searchInProgress'"}}:::output
search1["search <br> id='search-1'"] -- "algoliaUrl->algoliaUrl" --> algoliaSearchUrl{{"output <br> id='algoliaSearchUrl'"}}:::output
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
template2["template <br> id='template-2'"] -- "string->hnURL" --> searchResultData{{"output <br> id='searchResultData'"}}:::output
searchResult["spread <br> id='searchResult'"] -- "story_id->story_id" --> template2["template <br> id='template-2'"]
popStoryId["pop <br> id='popStoryId'"] -- "list->list" --> popStoryId["pop <br> id='popStoryId'"]
popStoryId["pop <br> id='popStoryId'"] -- "item->id" --> passthrough3(("passthrough <br> id='passthrough-3'")):::passthrough
searchResult["spread <br> id='searchResult'"] -- "story_id->id" --> passthrough3(("passthrough <br> id='passthrough-3'")):::passthrough
passthrough3(("passthrough <br> id='passthrough-3'")):::passthrough -- "id->id" --> getStory4["getStory <br> id='getStory-4'"]
getStory4["getStory <br> id='getStory-4'"] -- all --> passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough
passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough -- "algoliaUrl->algoliaUrl" --> story{{"output <br> id='story'"}}:::output
passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough -- "author->author" --> story{{"output <br> id='story'"}}:::output
passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough -- "created_at->created_at" --> story{{"output <br> id='story'"}}:::output
passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough -- "created_at_i->created_at_i" --> story{{"output <br> id='story'"}}:::output
passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough -- "points->points" --> story{{"output <br> id='story'"}}:::output
passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough -- "story_id->story_id" --> story{{"output <br> id='story'"}}:::output
passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough -- "title->title" --> story{{"output <br> id='story'"}}:::output
passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough -- "type->type" --> story{{"output <br> id='story'"}}:::output
passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough -- "url->url" --> story{{"output <br> id='story'"}}:::output
search1["search <br> id='search-1'"] -- "algoliaUrl->algoliaUrl" --> story{{"output <br> id='story'"}}:::output
passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough -- all --> nest7["nest <br> id='nest-7'"]
nest7["nest <br> id='nest-7'"] -- "story->object" --> limitDepth8["limitDepth <br> id='limitDepth-8'"]
limitDepth8["limitDepth <br> id='limitDepth-8'"] -- "object->object" --> stringify6["stringify <br> id='stringify-6'"]
passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough -- "story_id->story_id" --> templateText{{"output <br> id='templateText'"}}:::output
stringify6["stringify <br> id='stringify-6'"] -- "string->story" --> instructionTemplate["template <br> id='instructionTemplate'"]
passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough -- "story_id->story_id" --> pendingOutput{{"output <br> id='pendingOutput'"}}:::output
claudeApiKey[/"input <br> id='claudeApiKey'"/]:::input -- "claudeApiKey->apiKey" --> claudePostSummarisation["complete <br> id='claudePostSummarisation'"]
instructionTemplate["template <br> id='instructionTemplate'"] -- "string->userQuestion" --> claudePostSummarisation["complete <br> id='claudePostSummarisation'"]
passthrough5(("passthrough <br> id='passthrough-5'")):::passthrough -- "story_id->story_id" --> summary{{"output <br> id='summary'"}}:::output
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
	"edges": [
		{
			"from": "searchParams",
			"to": "search-1",
			"out": "query",
			"in": "query"
		},
		{
			"from": "searchParams",
			"to": "searchInProgress",
			"out": "query",
			"in": "query"
		},
		{
			"from": "searchParams",
			"to": "search-1",
			"out": "limit",
			"in": "limit"
		},
		{
			"from": "searchParams",
			"to": "searchInProgress",
			"out": "query",
			"in": "query"
		},
		{
			"from": "search-1",
			"to": "algoliaSearchUrl",
			"out": "algoliaUrl",
			"in": "algoliaUrl"
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
			"from": "template-2",
			"to": "searchResultData",
			"out": "string",
			"in": "hnURL"
		},
		{
			"from": "searchResult",
			"to": "template-2",
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
			"to": "passthrough-3",
			"out": "item",
			"in": "id"
		},
		{
			"from": "searchResult",
			"to": "passthrough-3",
			"out": "story_id",
			"in": "id"
		},
		{
			"from": "passthrough-3",
			"to": "getStory-4",
			"out": "id",
			"in": "id"
		},
		{
			"from": "getStory-4",
			"to": "passthrough-5",
			"out": "*"
		},
		{
			"from": "passthrough-5",
			"to": "story",
			"out": "algoliaUrl",
			"in": "algoliaUrl"
		},
		{
			"from": "passthrough-5",
			"to": "story",
			"out": "author",
			"in": "author"
		},
		{
			"from": "passthrough-5",
			"to": "story",
			"out": "created_at",
			"in": "created_at"
		},
		{
			"from": "passthrough-5",
			"to": "story",
			"out": "created_at_i",
			"in": "created_at_i"
		},
		{
			"from": "passthrough-5",
			"to": "story",
			"out": "points",
			"in": "points"
		},
		{
			"from": "passthrough-5",
			"to": "story",
			"out": "story_id",
			"in": "story_id"
		},
		{
			"from": "passthrough-5",
			"to": "story",
			"out": "title",
			"in": "title"
		},
		{
			"from": "passthrough-5",
			"to": "story",
			"out": "type",
			"in": "type"
		},
		{
			"from": "passthrough-5",
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
			"from": "passthrough-5",
			"to": "nest-7",
			"out": "*"
		},
		{
			"from": "nest-7",
			"to": "limitDepth-8",
			"out": "story",
			"in": "object"
		},
		{
			"from": "limitDepth-8",
			"to": "stringify-6",
			"out": "object",
			"in": "object"
		},
		{
			"from": "passthrough-5",
			"to": "templateText",
			"out": "story_id",
			"in": "story_id"
		},
		{
			"from": "stringify-6",
			"to": "instructionTemplate",
			"out": "string",
			"in": "story"
		},
		{
			"from": "passthrough-5",
			"to": "pendingOutput",
			"out": "story_id",
			"in": "story_id"
		},
		{
			"from": "claudeApiKey",
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
			"from": "passthrough-5",
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
				"limit": 2
			}
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
							"default": "2"
						}
					}
				}
			}
		},
		{
			"id": "searchInProgress",
			"type": "output"
		},
		{
			"id": "algoliaSearchUrl",
			"type": "output"
		},
		{
			"id": "claudeApiKey",
			"type": "input",
			"configuration": {
				"schema": {
					"title": "Please enter your API Key",
					"type": "password"
				}
			}
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
			"id": "template-2",
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
			"id": "passthrough-3",
			"type": "passthrough"
		},
		{
			"id": "getStory-4",
			"type": "getStory"
		},
		{
			"id": "passthrough-5",
			"type": "passthrough"
		},
		{
			"id": "story",
			"type": "output"
		},
		{
			"id": "stringify-6",
			"type": "stringify"
		},
		{
			"id": "nest-7",
			"type": "nest",
			"configuration": {
				"key": "story"
			}
		},
		{
			"id": "limitDepth-8",
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