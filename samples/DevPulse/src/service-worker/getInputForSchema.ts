import { Schema } from "@google-labs/breadboard";
import readline from "readline"

export function getInputForSchema(schema: Schema): Promise<{ [key: string]: string }> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const askQuestion = (query: string): Promise<string> => {
		return new Promise((resolve) => rl.question(query, resolve));
	};

	async function getInputFromSchema() {
		const userInput: { [key: string]: string } = {};

		for (const key in schema.properties) {
			const property = schema.properties[key];
			if (property.type === "string") {
				const answer = await askQuestion(`${property.title}: `);
				userInput[key] = answer;
			}
		}

		rl.close();
		return userInput;
	}

	return getInputFromSchema();
}
