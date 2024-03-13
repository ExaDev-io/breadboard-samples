import { InputValues, OutputValues } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";

function parametersFromTemplate(template: string): string[] {
	const matches = template.matchAll(/{{(?<name>[\w-]+)}}/g);
	const parameters = Array.from(matches).map(
		(match) => match.groups?.name || ""
	);
	return Array.from(new Set(parameters));
}

const stringify = (value: unknown): string => {
	if (typeof value === "string") return value;
	if (value === undefined) return "undefined";
	return JSON.stringify(value, null, 2);
};

function substitute(template: string, values: InputValues) {
	return Object.entries(values).reduce(
		(acc, [key, value]) => acc.replace(`{{${key}}}`, stringify(value)),
		template
	);
}

export const StringKit = new KitBuilder({
	url: "."
}).build({
	async template(inputs: InputValues): Promise<OutputValues> {
		const template = inputs.template

		if (typeof template !== "string") {
			throw new Error("The wired template is not 'string' type.");
		}

		const parameters = parametersFromTemplate(template);
		
		if (!parameters.length) return { string: template };
	
		const substitutes = parameters.reduce((acc, parameter) => {
			if (inputs[parameter] === undefined)
				return {}
			return { ...acc, [parameter]: inputs[parameter] };
		}, {});
	
		const string = substitute(template, substitutes);
	
		return Promise.resolve({ string });
	},
	async templateA(inputs: InputValues): Promise<OutputValues> {
		const template = "https://news.ycombinator.com/item?id={{story_id}}";
		// const template = inputs.template
		const parameters = parametersFromTemplate(template);
		
		if (!parameters.length) return { string: template };
	
		const substitutes = parameters.reduce((acc, parameter) => {
			if (inputs[parameter] === undefined)
				throw new Error(`Input is missing parameter "${parameter}"`);
			return { ...acc, [parameter]: inputs[parameter] };
		}, {});
	
		const string = substitute(template, substitutes);
	
		return Promise.resolve({ string });
	},
	async templateB(inputs: InputValues): Promise<OutputValues> {
		const instruction = "Summarise the discussion regarding this post";
		const templateText = [instruction, "```json", "{{story}}", "```"].join("\n");
		const template = templateText
		const parameters = parametersFromTemplate(template);
		
		if (!parameters.length) return { string: template };

		const substitutes = parameters.reduce((acc, parameter) => {
			if (inputs[parameter] === undefined)
				throw new Error(`Input is missing parameter "${parameter}"`);
			return { ...acc, [parameter]: inputs[parameter] };
		}, {});

		const string = substitute(template, substitutes);

		return Promise.resolve({ string });
	}
})

export type StringKit = InstanceType<typeof StringKit>;
export default StringKit;



    // templateA: async (inputs) => (
    //     {
    //         string: await templateA(inputs)
    //     }
    // ),
	// templateB: async (inputs) => (
    //     {
    //         string: await templateB(inputs)
    //     }
    // ),

// const templateA = code<{ inputs: InputValues}, { string: string; }>(async ({ inputs }) => {
// 	const template = "https://news.ycombinator.com/item?id={{story_id}}";
// 	// const template = inputs.template
// 	const parameters = parametersFromTemplate(template);
	
// 	if (!parameters.length) return { string: template };

// 	const substitutes = parameters.reduce((acc, parameter) => {
// 		if (inputs[parameter] === undefined)
// 			throw new Error(`Input is missing parameter "${parameter}"`);
// 		return { ...acc, [parameter]: inputs[parameter] };
// 	}, {});

// 	const string = substitute(template, substitutes);

// 	return Promise.resolve({ string });
// })

// const templateB = code<{ inputs: InputValues}, { string: string; }>(async ({ inputs }) => {
// 	const instruction = "Summarise the discussion regarding this post";
//     const templateText = [instruction, "```json", "{{story}}", "```"].join("\n");
// 	const template = templateText
// 	const parameters = parametersFromTemplate(template);
	
// 	if (!parameters.length) return { string: template };

// 	const substitutes = parameters.reduce((acc, parameter) => {
// 		if (inputs[parameter] === undefined)
// 			throw new Error(`Input is missing parameter "${parameter}"`);
// 		return { ...acc, [parameter]: inputs[parameter] };
// 	}, {});

// 	const string = substitute(template, substitutes);

// 	return Promise.resolve({ string });
// })