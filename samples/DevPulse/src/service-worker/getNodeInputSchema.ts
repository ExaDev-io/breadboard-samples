import { Edge, RunResult, Schema } from "@google-labs/breadboard";

export function getInputSchemaFromNode(runResult: RunResult): Schema {
	let schema: Schema;
	const inputAttribute: string = runResult.state.newOpportunities.find(
		(op: Edge) => op.from == runResult.node.id
	)!.out!;

	const schemaFromOpportunity = {
		type: "object",
		properties: {
			[inputAttribute]: {
				title: inputAttribute,
				type: "string",
			},
		},
	};

	if (runResult.inputArguments.schema) {
		schema = runResult.inputArguments.schema as Schema;
		if (inputAttribute == "*") {
			return schema;
		}
		if (!Object.keys(schema.properties!).includes(inputAttribute)) {
			throw new Error(
				`Input attribute "${inputAttribute}" not found in schema:\n${JSON.stringify(
					schema,
					null,
					2
				)}`
			);
		}
	} else {
		schema = schemaFromOpportunity;
	}
	return schema;
}

export function getInputAttributeSchemaFromNodeSchema(schema: Schema): {
	key: string;
	schema: Schema;
} {
	const key = Object.keys(schema.properties!)[0];
	// return first property in schema
	return {
		key,
		schema: schema.properties![key],
	};
}
