# multiple-outputs.ts

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
input1[/"input <br> id='input-1'"/]:::input -- "parteOne->parteOne" --> output2{{"output <br> id='output-2'"}}:::output
input1[/"input <br> id='input-1'"/]:::input -- "partTwo->partTwo" --> output3{{"output <br> id='output-3'"}}:::output
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
	"title": "multiple-outputs.ts",
	"edges": [
		{
			"from": "input-1",
			"to": "output-2",
			"out": "parteOne",
			"in": "parteOne"
		},
		{
			"from": "input-1",
			"to": "output-3",
			"out": "partTwo",
			"in": "partTwo"
		}
	],
	"nodes": [
		{
			"id": "input-1",
			"type": "input"
		},
		{
			"id": "output-2",
			"type": "output"
		},
		{
			"id": "output-3",
			"type": "output"
		}
	],
	"kits": []
}
```