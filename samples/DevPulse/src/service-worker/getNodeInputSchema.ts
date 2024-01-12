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
		if (
			schema.properties &&
			!Object.keys(schema.properties).includes(inputAttribute)
		) {
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

export type KeyedInputSchema = {
	key: string;
	schema: Schema;
};

export function getInputAttributeSchemaFromNodeSchema(
	schema: Schema
): KeyedInputSchema[] {
	return Object.keys(schema.properties ?? []).map((key) => ({
		key,
		schema: schema.properties![key],
	}));
}
