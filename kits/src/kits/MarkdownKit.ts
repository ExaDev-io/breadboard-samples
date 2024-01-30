/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { KitBuilder, KitBuilderOptions } from "@google-labs/breadboard/kits";
import { InputValues, NodeConfiguration, NodeDescriptor } from "@google-labs/breadboard";
import { Board, Edge } from "@google-labs/breadboard";
import { makeMarkdown } from "../util/files/makeMarkdown.js"
import { MarkdownContentType } from "../types/markdown.js";
import { MarkdownContentList } from "../types/markdown.js";
export const MarkdownKit = new KitBuilder({
	url: "npm:@exadev/breadboard-kits/markdownKit",
}).build({
	async generateCombinedMarkdown(inputs: InputValues & {
		boardjson: string,
		filename: string,
		title: string,
		dir: string
	}): Promise<void> {
		const { boardjson, filename, title, dir }: InputValues = inputs

		const board = jsonStringToBoard(boardjson);
		const markdownConfig: MarkdownContentList = [MarkdownContentType.mermaid, MarkdownContentType.json];

		makeMarkdown({ board, filename, title, dir, markdownConfig });
	},

	async generateJson(inputs: InputValues & {
		boardjson: string,
		filename: string,
		title: string,
		dir: string
	}): Promise<void> {
		const { boardjson, filename, title, dir }: InputValues = inputs

		const board = jsonStringToBoard(boardjson);
		const markdownConfig: MarkdownContentList = [MarkdownContentType.json];

		makeMarkdown({ board, filename, title, dir, markdownConfig });
	},
	async generateMermaid(inputs: InputValues & {
		boardjson: string,
		filename: string,
		title: string,
		dir: string
	}): Promise<void> {
		const { boardjson, filename, title, dir }: InputValues = inputs

		const board = jsonStringToBoard(boardjson);
		const markdownConfig: MarkdownContentList = [MarkdownContentType.mermaid];

		makeMarkdown({ board, filename, title, dir, markdownConfig });
	},
});

export type MarkdownKit = InstanceType<typeof MarkdownKit>;
export default MarkdownKit;

// Parse json and re-construct the original board + kits
// this has to be done because NodeValues don't support Board type
function jsonStringToBoard(jsonString: string): Board {
	// parse json string 
	const json = JSON.parse(jsonString);
	// extract fields of input board from json fields
	const title = json.title
	const description = json.description
	const version = json.version
	const edges = json.edges as Edge[]
	const nodes = json.nodes
	const kits = json.kits
	// reconstruct board 
	const board = new Board({
		title: title,
		description: description,
		version: version,
	});
	// add edges back to board
	edges.forEach(function (edge: Edge) {
		board.addEdge(edge);
	})
	// add nodes back to board
	nodes.forEach(function (node: { id: string; type: string; configuration: NodeConfiguration; }) {
		const id = node.id;
		const type = node.type;
		const configuration = node.configuration;
		const descriptor: NodeDescriptor = { id, type, configuration };

		board.addNode(descriptor);
	})
	// add kits back to board
	kits.forEach(function (kit: { url: string; title: string; description: string; version: string; }) {
		const url = kit.url
		const title = kit.title
		const description = kit.description
		const version = kit.version

		// functions of the kit don't matter, we just need to populate the kit field in the markdown
		const kitBuilderOptions: KitBuilderOptions = { url, title, description, version };
		const boardKit = new KitBuilder(kitBuilderOptions).build({});

		board.addKit(boardKit);
	});

	return board
}
