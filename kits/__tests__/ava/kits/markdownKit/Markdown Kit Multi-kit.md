# Markdown Kit Multi-kit

## Mermaid
```mermaid
```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
input[/"input <br> id='input'"/]:::input -- "a->a" --> concat1["concat <br> id='concat-1'"]
input[/"input <br> id='input'"/]:::input -- "b->b" --> concat1["concat <br> id='concat-1'"]
concat1["concat <br> id='concat-1'"] -- "list->list" --> output2{{"output <br> id='output-2'"}}:::output
board[/"input <br> id='board'"/]:::input -- "boardjson->boardjson" --> generateCombinedMarkdown3["generateCombinedMarkdown <br> id='generateCombinedMarkdown-3'"]
filename[/"input <br> id='filename'"/]:::input -- "filename->filename" --> generateCombinedMarkdown3["generateCombinedMarkdown <br> id='generateCombinedMarkdown-3'"]
title[/"input <br> id='title'"/]:::input -- "title->title" --> generateCombinedMarkdown3["generateCombinedMarkdown <br> id='generateCombinedMarkdown-3'"]
directory[/"input <br> id='directory'"/]:::input -- "dir->dir" --> generateCombinedMarkdown3["generateCombinedMarkdown <br> id='generateCombinedMarkdown-3'"]
classDef default stroke:#ffab40,fill:#fff2ccff,color:#000
classDef input stroke:#3c78d8,fill:#c9daf8ff,color:#000
classDef output stroke:#38761d,fill:#b6d7a8ff,color:#000
classDef passthrough stroke:#a64d79,fill:#ead1dcff,color:#000
classDef slot stroke:#a64d79,fill:#ead1dcff,color:#000
classDef config stroke:#a64d79,fill:#ead1dcff,color:#000
classDef secrets stroke:#db4437,fill:#f4cccc,color:#000
classDef slotted stroke:#a64d79
```
```

## JSON
```json
{
	"title": "Markdown Kit Multi-kit",
	"description": "Exadev Markdown Kit Multi-kit Test",
	"version": "0.0.1",
	"edges": [
		{
			"from": "input",
			"to": "concat-1",
			"out": "a",
			"in": "a"
		},
		{
			"from": "input",
			"to": "concat-1",
			"out": "b",
			"in": "b"
		},
		{
			"from": "concat-1",
			"to": "output-2",
			"out": "list",
			"in": "list"
		},
		{
			"from": "board",
			"to": "generateCombinedMarkdown-3",
			"out": "boardjson",
			"in": "boardjson"
		},
		{
			"from": "filename",
			"to": "generateCombinedMarkdown-3",
			"out": "filename",
			"in": "filename"
		},
		{
			"from": "title",
			"to": "generateCombinedMarkdown-3",
			"out": "title",
			"in": "title"
		},
		{
			"from": "directory",
			"to": "generateCombinedMarkdown-3",
			"out": "dir",
			"in": "dir"
		}
	],
	"nodes": [
		{
			"id": "input",
			"type": "input",
			"configuration": {
				"schema": {
					"type": "object",
					"properties": {
						"text": {
							"type": "string",
							"title": "Text",
							"description": "concat"
						}
					}
				}
			}
		},
		{
			"id": "concat-1",
			"type": "concat"
		},
		{
			"id": "output-2",
			"type": "output"
		},
		{
			"id": "board",
			"type": "input",
			"configuration": {
				"schema": {
					"type": "object",
					"properties": {
						"text": {
							"type": "string",
							"title": "Text",
							"description": "concat"
						}
					}
				}
			}
		},
		{
			"id": "filename",
			"type": "input",
			"configuration": {
				"schema": {
					"type": "object",
					"properties": {
						"text": {
							"type": "string",
							"title": "Text",
							"description": "concat"
						}
					}
				}
			}
		},
		{
			"id": "title",
			"type": "input",
			"configuration": {
				"schema": {
					"type": "object",
					"properties": {
						"text": {
							"type": "string",
							"title": "Text",
							"description": "concat"
						}
					}
				}
			}
		},
		{
			"id": "directory",
			"type": "input",
			"configuration": {
				"schema": {
					"type": "object",
					"properties": {
						"text": {
							"type": "string",
							"title": "Text",
							"description": "concat"
						}
					}
				}
			}
		},
		{
			"id": "generateCombinedMarkdown-3",
			"type": "generateCombinedMarkdown"
		}
	],
	"kits": [
		{
			"url": "npm:@exadev/breadboard-kits/list"
		},
		{
			"url": "npm:@exadev/breadboard-kits/markdownKit"
		}
	]
}
```