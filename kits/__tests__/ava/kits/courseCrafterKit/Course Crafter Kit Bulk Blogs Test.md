# Course Crafter Kit Bulk Blogs Test

## Mermaid
```mermaid
```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
blogUrls[/"input <br> id='blogUrls'"/]:::input -- "list->list" --> getBlogsContent["getBlogsContent <br> id='getBlogsContent'"]
taskDetails[/"input <br> id='taskDetails'"/]:::input -- "model->model" --> summaryLanguageModel["pipelineBulk <br> id='summaryLanguageModel'"]
taskDetails[/"input <br> id='taskDetails'"/]:::input -- "task->task" --> summaryLanguageModel["pipelineBulk <br> id='summaryLanguageModel'"]
getBlogsContent["getBlogsContent <br> id='getBlogsContent'"] -- "blogOutput->inputs" --> summaryLanguageModel["pipelineBulk <br> id='summaryLanguageModel'"]
summaryLanguageModel["pipelineBulk <br> id='summaryLanguageModel'"] -- all --> outputSummary{{"output <br> id='outputSummary'"}}:::output
promptDetails[/"input <br> id='promptDetails'"/]:::input -- "template->template" --> claudePromptConstructor["template <br> id='claudePromptConstructor'"]
getBlogsContent["getBlogsContent <br> id='getBlogsContent'"] -- "blogOutput->blogContents" --> claudePromptConstructor["template <br> id='claudePromptConstructor'"]
summaryLanguageModel["pipelineBulk <br> id='summaryLanguageModel'"] -- "summaries->summaries" --> claudePromptConstructor["template <br> id='claudePromptConstructor'"]
secrets1("secrets <br> id='secrets-1'"):::secrets -- "CLAUDE_KEY->apiKey" --> claudeAPI["complete <br> id='claudeAPI'"]
claudePromptConstructor["template <br> id='claudePromptConstructor'"] -- "string->userQuestion" --> claudeAPI["complete <br> id='claudeAPI'"]
claudeAPI["complete <br> id='claudeAPI'"] -- "completion->completion" --> outputSummary{{"output <br> id='outputSummary'"}}:::output
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
	"title": "Course Crafter Kit Bulk Blogs Test",
	"description": "Course Crafter Kit Bulk Blogs Testt",
	"version": "0.0.1",
	"edges": [
		{
			"from": "blogUrls",
			"to": "getBlogsContent",
			"out": "list",
			"in": "list"
		},
		{
			"from": "taskDetails",
			"to": "summaryLanguageModel",
			"out": "model",
			"in": "model"
		},
		{
			"from": "taskDetails",
			"to": "summaryLanguageModel",
			"out": "task",
			"in": "task"
		},
		{
			"from": "getBlogsContent",
			"to": "summaryLanguageModel",
			"out": "blogOutput",
			"in": "inputs"
		},
		{
			"from": "summaryLanguageModel",
			"to": "outputSummary",
			"out": "*"
		},
		{
			"from": "promptDetails",
			"to": "claudePromptConstructor",
			"out": "template",
			"in": "template"
		},
		{
			"from": "getBlogsContent",
			"to": "claudePromptConstructor",
			"out": "blogOutput",
			"in": "blogContents"
		},
		{
			"from": "summaryLanguageModel",
			"to": "claudePromptConstructor",
			"out": "summaries",
			"in": "summaries"
		},
		{
			"from": "secrets-1",
			"to": "claudeAPI",
			"out": "CLAUDE_KEY",
			"in": "apiKey"
		},
		{
			"from": "claudePromptConstructor",
			"to": "claudeAPI",
			"out": "string",
			"in": "userQuestion"
		},
		{
			"from": "claudeAPI",
			"to": "outputSummary",
			"out": "completion",
			"in": "completion"
		}
	],
	"nodes": [
		{
			"id": "blogUrls",
			"type": "input",
			"configuration": {
				"schema": {
					"type": "object",
					"properties": {
						"text": {
							"type": "list",
							"title": "Text",
							"description": "urls"
						}
					}
				}
			}
		},
		{
			"id": "taskDetails",
			"type": "input",
			"configuration": {
				"schema": {
					"type": "object",
					"properties": {
						"text": {
							"type": "string",
							"title": "Text",
							"description": "urls"
						}
					}
				}
			}
		},
		{
			"id": "promptDetails",
			"type": "input",
			"configuration": {
				"schema": {
					"type": "object",
					"properties": {
						"text": {
							"type": "string",
							"title": "Text",
							"description": "urls"
						}
					}
				}
			}
		},
		{
			"id": "getBlogsContent",
			"type": "getBlogsContent"
		},
		{
			"id": "outputSummary",
			"type": "output"
		},
		{
			"id": "summaryLanguageModel",
			"type": "pipelineBulk"
		},
		{
			"id": "claudePromptConstructor",
			"type": "template",
			"configuration": {
				"template": "Based these summaries of blog posts:/n{{summaries}}/nand the original text: /n{{blogContents}}/ncan you outline topics discussed in each blog? For each blog give me code sample on how to achieve the discussed topic. Output result in markdown format, do not include the summary text in the output. Separate discussed topics in bullet points."
			}
		},
		{
			"id": "secrets-1",
			"type": "secrets",
			"configuration": {
				"keys": [
					"CLAUDE_KEY"
				]
			}
		},
		{
			"id": "claudeAPI",
			"type": "complete",
			"configuration": {
				"model": "claude-2",
				"url": "https://api.anthropic.com/v1/complete"
			}
		}
	],
	"kits": [
		{
			"url": "npm@exadev/breadboard-kits/CourseCrafter"
		},
		{
			"url": "npm:@xenova/transformers"
		},
		{
			"url": "npm:@exadev/breadboard-kits/Claude"
		},
		{
			"url": "npm:@exadev/breadboard-kits/kits/StringKit"
		},
		{
			"url": "npm:@google-labs/llm-starter"
		}
	]
}
```