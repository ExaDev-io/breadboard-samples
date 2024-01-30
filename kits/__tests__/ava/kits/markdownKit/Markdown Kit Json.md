# Markdown Kit Json

## JSON
```json
{
	"title": "Markdown Kit Json",
	"description": "Exadev Markdown Kit Json Test",
	"version": "0.0.1",
	"edges": [
		{
			"from": "board",
			"to": "generateJson-1",
			"out": "boardjson",
			"in": "boardjson"
		},
		{
			"from": "filename",
			"to": "generateJson-1",
			"out": "filename",
			"in": "filename"
		},
		{
			"from": "title",
			"to": "generateJson-1",
			"out": "title",
			"in": "title"
		},
		{
			"from": "directory",
			"to": "generateJson-1",
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
			"id": "generateJson-1",
			"type": "generateJson"
		}
	],
	"kits": [
		{
			"url": "npm:@exadev/breadboard-kits/markdownKit"
		}
	]
}
```