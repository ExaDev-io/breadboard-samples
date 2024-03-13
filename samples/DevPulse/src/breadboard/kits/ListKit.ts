import { InputValues, NodeValue, OutputValues } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";

export type EmptyObject = Record<string, never>;

export const ListKit = new KitBuilder({
	url: "."
}).build({
	async pop(inputs: InputValues): Promise<OutputValues & (EmptyObject | {
		item: NodeValue;
		list: NodeValue[];
	})> {
		if (
			!inputs.list ||
			!Array.isArray(inputs.list) ||
			(Array.isArray(inputs.list) && inputs.list.length == 0)
		) {
			return {};
		}
		const list: NodeValue[] = inputs.list as NodeValue[];
		const item: NodeValue = list.pop();
		return Promise.resolve({ item, list });
	}
})

export type ListKit = InstanceType<typeof ListKit>;
export default ListKit;