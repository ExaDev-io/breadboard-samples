# DevPulse

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
searchQuery[/"input <br> id='searchQuery'"/]:::input -- "query->query" --> passthrough2(("passthrough <br> id='passthrough-2'")):::passthrough
passthrough2(("passthrough <br> id='passthrough-2'")):::passthrough -- all --> search1["search <br> id='search-1'"]
search1["search <br> id='search-1'"] -- "algoliaUrl->algoliaUrl" --> algoliaSearchUrl{{"output <br> id='algoliaSearchUrl'"}}:::output
searchQuery[/"input <br> id='searchQuery'"/]:::input -- "query->query" --> algoliaSearchUrl{{"output <br> id='algoliaSearchUrl'"}}:::output
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
template3["template <br> id='template-3'"] -- "string->hnURL" --> searchResultData{{"output <br> id='searchResultData'"}}:::output
searchResult["spread <br> id='searchResult'"] -- "story_id->story_id" --> template3["template <br> id='template-3'"]
popStoryId["pop <br> id='popStoryId'"] -- "list->list" --> popStoryId["pop <br> id='popStoryId'"]
popStoryId["pop <br> id='popStoryId'"] -- "item->id" --> passthrough4(("passthrough <br> id='passthrough-4'")):::passthrough
searchResult["spread <br> id='searchResult'"] -- "story_id->id" --> passthrough4(("passthrough <br> id='passthrough-4'")):::passthrough
passthrough4(("passthrough <br> id='passthrough-4'")):::passthrough -- "id->id" --> getStory5["getStory <br> id='getStory-5'"]
getStory5["getStory <br> id='getStory-5'"] -- all --> passthrough6(("passthrough <br> id='passthrough-6'")):::passthrough
passthrough6(("passthrough <br> id='passthrough-6'")):::passthrough -- "algoliaUrl->algoliaUrl" --> story{{"output <br> id='story'"}}:::output
passthrough6(("passthrough <br> id='passthrough-6'")):::passthrough -- "author->author" --> story{{"output <br> id='story'"}}:::output
passthrough6(("passthrough <br> id='passthrough-6'")):::passthrough -- "created_at->created_at" --> story{{"output <br> id='story'"}}:::output
passthrough6(("passthrough <br> id='passthrough-6'")):::passthrough -- "created_at_i->created_at_i" --> story{{"output <br> id='story'"}}:::output
passthrough6(("passthrough <br> id='passthrough-6'")):::passthrough -- "points->points" --> story{{"output <br> id='story'"}}:::output
passthrough6(("passthrough <br> id='passthrough-6'")):::passthrough -- "story_id->story_id" --> story{{"output <br> id='story'"}}:::output
passthrough6(("passthrough <br> id='passthrough-6'")):::passthrough -- "title->title" --> story{{"output <br> id='story'"}}:::output
passthrough6(("passthrough <br> id='passthrough-6'")):::passthrough -- "type->type" --> story{{"output <br> id='story'"}}:::output
passthrough6(("passthrough <br> id='passthrough-6'")):::passthrough -- "url->url" --> story{{"output <br> id='story'"}}:::output
search1["search <br> id='search-1'"] -- "algoliaUrl->algoliaUrl" --> story{{"output <br> id='story'"}}:::output
searchQuery[/"input <br> id='searchQuery'"/]:::input -- "query->query" --> story{{"output <br> id='story'"}}:::output
passthrough6(("passthrough <br> id='passthrough-6'")):::passthrough -- all --> nest8["nest <br> id='nest-8'"]
nest8["nest <br> id='nest-8'"] -- "story->object" --> limitDepth9["limitDepth <br> id='limitDepth-9'"]
limitDepth9["limitDepth <br> id='limitDepth-9'"] -- "object->object" --> stringify7["stringify <br> id='stringify-7'"]
passthrough6(("passthrough <br> id='passthrough-6'")):::passthrough -- "story_id->story_id" --> templateText{{"output <br> id='templateText'"}}:::output
stringify7["stringify <br> id='stringify-7'"] -- "string->story" --> instructionTemplate["template <br> id='instructionTemplate'"]
passthrough6(("passthrough <br> id='passthrough-6'")):::passthrough -- "story_id->story_id" --> pendingOutput{{"output <br> id='pendingOutput'"}}:::output
claudeApiKey[/"input <br> id='claudeApiKey'"/]:::input -- "apiKey->apiKey" --o claudePostSummarisation["complete <br> id='claudePostSummarisation'"]
instructionTemplate["template <br> id='instructionTemplate'"] -- "string->userQuestion" --> claudePostSummarisation["complete <br> id='claudePostSummarisation'"]
passthrough6(("passthrough <br> id='passthrough-6'")):::passthrough -- "story_id->story_id" --> summary{{"output <br> id='summary'"}}:::output
claudePostSummarisation["complete <br> id='claudePostSummarisation'"] -- "completion->summary" --> summary{{"output <br> id='summary'"}}:::output
claudePostSummarisation["complete <br> id='claudePostSummarisation'"] -- all --> summary{{"output <br> id='summary'"}}:::output
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
			"from": "searchQuery",
			"to": "passthrough-2",
			"out": "query",
			"in": "query"
		},
		{
			"from": "passthrough-2",
			"to": "search-1",
			"out": "*"
		},
		{
			"from": "search-1",
			"to": "algoliaSearchUrl",
			"out": "algoliaUrl",
			"in": "algoliaUrl"
		},
		{
			"from": "searchQuery",
			"to": "algoliaSearchUrl",
			"out": "query",
			"in": "query"
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
			"from": "template-3",
			"to": "searchResultData",
			"out": "string",
			"in": "hnURL"
		},
		{
			"from": "searchResult",
			"to": "template-3",
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
			"to": "passthrough-4",
			"out": "item",
			"in": "id"
		},
		{
			"from": "searchResult",
			"to": "passthrough-4",
			"out": "story_id",
			"in": "id"
		},
		{
			"from": "passthrough-4",
			"to": "getStory-5",
			"out": "id",
			"in": "id"
		},
		{
			"from": "getStory-5",
			"to": "passthrough-6",
			"out": "*"
		},
		{
			"from": "passthrough-6",
			"to": "story",
			"out": "algoliaUrl",
			"in": "algoliaUrl"
		},
		{
			"from": "passthrough-6",
			"to": "story",
			"out": "author",
			"in": "author"
		},
		{
			"from": "passthrough-6",
			"to": "story",
			"out": "created_at",
			"in": "created_at"
		},
		{
			"from": "passthrough-6",
			"to": "story",
			"out": "created_at_i",
			"in": "created_at_i"
		},
		{
			"from": "passthrough-6",
			"to": "story",
			"out": "points",
			"in": "points"
		},
		{
			"from": "passthrough-6",
			"to": "story",
			"out": "story_id",
			"in": "story_id"
		},
		{
			"from": "passthrough-6",
			"to": "story",
			"out": "title",
			"in": "title"
		},
		{
			"from": "passthrough-6",
			"to": "story",
			"out": "type",
			"in": "type"
		},
		{
			"from": "passthrough-6",
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
			"from": "searchQuery",
			"to": "story",
			"out": "query",
			"in": "query"
		},
		{
			"from": "passthrough-6",
			"to": "nest-8",
			"out": "*"
		},
		{
			"from": "nest-8",
			"to": "limitDepth-9",
			"out": "story",
			"in": "object"
		},
		{
			"from": "limitDepth-9",
			"to": "stringify-7",
			"out": "object",
			"in": "object"
		},
		{
			"from": "passthrough-6",
			"to": "templateText",
			"out": "story_id",
			"in": "story_id"
		},
		{
			"from": "stringify-7",
			"to": "instructionTemplate",
			"out": "string",
			"in": "story"
		},
		{
			"from": "passthrough-6",
			"to": "pendingOutput",
			"out": "story_id",
			"in": "story_id"
		},
		{
			"from": "claudeApiKey",
			"to": "claudePostSummarisation",
			"constant": true,
			"out": "apiKey",
			"in": "apiKey"
		},
		{
			"from": "instructionTemplate",
			"to": "claudePostSummarisation",
			"out": "string",
			"in": "userQuestion"
		},
		{
			"from": "passthrough-6",
			"to": "summary",
			"out": "story_id",
			"in": "story_id"
		},
		{
			"from": "claudePostSummarisation",
			"to": "summary",
			"out": "completion",
			"in": "summary"
		},
		{
			"from": "claudePostSummarisation",
			"to": "summary",
			"out": "*"
		}
	],
	"nodes": [
		{
			"id": "searchQuery",
			"type": "input",
			"configuration": {
				"schema": {
					"type": "object",
					"properties": {
						"searchQuery": {
							"type": "string",
							"title": "searchQuery"
						}
					}
				}
			}
		},
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
			"id": "passthrough-2",
			"type": "passthrough"
		},
		{
			"id": "algoliaSearchUrl",
			"type": "output"
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
			"id": "template-3",
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
			"id": "passthrough-4",
			"type": "passthrough"
		},
		{
			"id": "getStory-5",
			"type": "getStory"
		},
		{
			"id": "passthrough-6",
			"type": "passthrough"
		},
		{
			"id": "story",
			"type": "output"
		},
		{
			"id": "claudeApiKey",
			"type": "input"
		},
		{
			"id": "stringify-7",
			"type": "stringify"
		},
		{
			"id": "nest-8",
			"type": "nest",
			"configuration": {
				"key": "story"
			}
		},
		{
			"id": "limitDepth-9",
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