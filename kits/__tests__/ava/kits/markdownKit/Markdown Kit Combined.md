# Markdown Kit Combined

## Mermaid
```mermaid
```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
board[/"input <br> id='board'"/]:::input -- "boardjson->boardjson" --> generateCombinedMarkdown1["generateCombinedMarkdown <br> id='generateCombinedMarkdown-1'"]
filename[/"input <br> id='filename'"/]:::input -- "filename->filename" --> generateCombinedMarkdown1["generateCombinedMarkdown <br> id='generateCombinedMarkdown-1'"]
title[/"input <br> id='title'"/]:::input -- "title->title" --> generateCombinedMarkdown1["generateCombinedMarkdown <br> id='generateCombinedMarkdown-1'"]
directory[/"input <br> id='directory'"/]:::input -- "dir->dir" --> generateCombinedMarkdown1["generateCombinedMarkdown <br> id='generateCombinedMarkdown-1'"]
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
	"title": "Markdown Kit Combined",
	"description": "Exadev Markdown Kit Combined Test",
	"version": "0.0.1",
	"edges": [
		{
			"from": "board",
			"to": "generateCombinedMarkdown-1",
			"out": "boardjson",
			"in": "boardjson"
		},
		{
			"from": "filename",
			"to": "generateCombinedMarkdown-1",
			"out": "filename",
			"in": "filename"
		},
		{
			"from": "title",
			"to": "generateCombinedMarkdown-1",
			"out": "title",
			"in": "title"
		},
		{
			"from": "directory",
			"to": "generateCombinedMarkdown-1",
			"out": "dir",
			"in": "dir"
		}
	],
	"nodes": [
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
			"id": "generateCombinedMarkdown-1",
			"type": "generateCombinedMarkdown"
		}
	],
	"kits": [
		{
			"url": "npm:@exadev/breadboard-kits/markdownKit"
		}
	]
}
```