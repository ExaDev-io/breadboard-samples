import {InputValues, NodeValue, OutputValues, } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";

export const FilterKit = new KitBuilder({
	url: "npm:@exadev/filterKit",
}).build({
	async filter(
		inputs: InputValues & {
			list?: string[];
			filter?: string;
		}
	): Promise<OutputValues & { list: NodeValue[]; }> {
		if (!inputs.list) {
			throw new Error("list required");
		}
		if (!inputs.filter) {
			throw new Error("filter required");
		}

		const regex = new RegExp(inputs.filter);
		return Promise.resolve({
			list: inputs.list.filter((item) => regex.test(item)),
		});
	},
	async filterObjects(
		inputs: InputValues & {
			list?: {
				[key: string]: NodeValue;
			}[];
			filter?: string;
			attribute?: string;
		}
	): Promise<OutputValues & { list: NodeValue[]; }> {
		if (!inputs.list) {
			throw new Error("list required");
		}
		if (!inputs.filter) {
			throw new Error("filter required");
		}
		if (!inputs.attribute) {
			throw new Error("attribute required");
		}

		const regex = new RegExp(inputs.filter);
		const included = inputs.list.filter(
			(item) =>
				inputs.attribute && regex.test(item[inputs.attribute] as string)
		);
		const excluded = inputs.list.filter(
			(item) => included.indexOf(item) === -1
		);

		return Promise.resolve({
			list: included,
			included,
			excluded,
		});
	},
	async deduplicate(
		inputs: InputValues & {
			list?: string[];
		}
	): Promise<OutputValues & { list: NodeValue[]; }> {
		if (!inputs.list) {
			throw new Error("list required");
		}
		return Promise.resolve({
			list: [...new Set(inputs.list)],
		});
	}
});

export type FilterKit = InstanceType<typeof FilterKit>;
export default FilterKit
