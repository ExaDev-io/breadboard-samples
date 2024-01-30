import test from "ava";
import { getModels, runPipeline } from "../../../../src/kits/XenovaKit.js";
import {
	Direction,
	GetModelsParams,
	SortModels,
	TransformerTask,
} from "../../../../src/types/xenova.js";

//
// test("xenova.Test", async (t) => {
// 	t.timeout(500000000) // this test runs for a long time, so set a big timeout
// 	const board = new Board({
// 		title: "Xenova Test",
// 		description: "Exadev Xenova Kit Test",
// 		version: "0.0.1",
// 	});
//
// 	const listKit = board.addKit(ListKit);
// 	const core = board.addKit(Core);
// 	const xenovaKit = board.addKit(XenovaKit);
//
// 	const selectedModels = SummarisationModels;
// 	const transformerModels = xenovaKit.getModels({
// 		sort: "downloads",
// 		filter: "transformers.js",
// 	});
// 	const onnx = xenovaKit.getModels({
// 		sort: "downloads",
// 		filter: "onnx",
// 	});
//
// 	const popModel = listKit.pop();
// 	const filterKit = board.addKit(FilterKit);
//
// 	const transformerTextClassificationModels = filterKit.filterObjects({
// 		$id: "transformerJsTextClassificationModels",
// 		filter: "text-classification",
// 		attribute: "pipeline_tag",
// 	});
// 	transformerModels.wire("models->list", transformerTextClassificationModels);
//
// 	const onnxTextClassificationModels = filterKit.filterObjects({
// 		$id: "onnxTextClassificationModels",
// 		filter: "text-classification",
// 		attribute: "pipeline_tag",
// 	});
// 	onnx.wire("models->list", onnxTextClassificationModels);
//
// 	const transformerJsSummarisationModels = filterKit.filterObjects({
// 		$id: "summarizationModels",
// 		filter: "summarization",
// 		attribute: "pipeline_tag",
// 	});
// 	transformerModels.wire("models->list", transformerJsSummarisationModels);
//
// 	const onnxSummarisationModels = filterKit.filterObjects({
// 		$id: "summarizationModels",
// 		filter: "summarization",
// 		attribute: "pipeline_tag",
// 	});
// 	onnx.wire("models->list", onnxSummarisationModels);
//
// 	const transformerJsDocumentQuestionAnsweringModels = filterKit.filterObjects({
// 		$id: "documentQuestionAnsweringModels",
// 		filter: "document-question-answering",
// 		attribute: "pipeline_tag",
// 	});
// 	transformerModels.wire("models->list", transformerJsDocumentQuestionAnsweringModels);
//
// 	const onnxDocumentQuestionAnsweringModels = filterKit.filterObjects({
// 		$id: "documentQuestionAnsweringModels",
// 		filter: "document-question-answering",
// 		attribute: "pipeline_tag",
// 	});
// 	onnx.wire("models->list", onnxDocumentQuestionAnsweringModels);
//
// 	const transformerJsModelsMergeA = listKit.concat();
// 	const transformerJsModels = listKit.concat();
//
// 	transformerJsModelsMergeA.wire("list->a", transformerJsModels);
// 	transformerJsDocumentQuestionAnsweringModels.wire("list->b", transformerJsModels);
// 	transformerTextClassificationModels.wire("list->a", transformerJsModelsMergeA);
// 	transformerJsSummarisationModels.wire("list->b", transformerJsModelsMergeA);
//
// 	const onnxModelsMergeA = listKit.concat();
// 	const onnxModels = listKit.concat();
//
// 	onnxModelsMergeA.wire("list->a", onnxModels);
// 	onnxDocumentQuestionAnsweringModels.wire("list->b", onnxModels);
// 	onnxTextClassificationModels.wire("list->a", onnxModelsMergeA);
// 	onnxSummarisationModels.wire("list->b", onnxModelsMergeA);
//
// 	const allModels = listKit.concat();
// 	transformerJsModels.wire("list->a", allModels);
// 	onnxModels.wire("list->b", allModels);
//
// 	const deduplicatedModels = filterKit.deduplicate();
// 	deduplicatedModels.wire("list", board.output({ $id: "models" }));
//
// 	allModels.wire("list", deduplicatedModels);
// 	popModel.wire("list", popModel);
//
// 	const transformer = xenovaKit.pipeline({
// 		$id: "xenova-transformer",
// 		input: "Kittens and puppies are lovely",
// 		task: selectedModels.task,
// 	});
//
// 	const modelIdList = core.passthrough({
// 		$id: "passThrough",
// 		...selectedModels
// 	});
//
// 	const output = board.output()
// 	const popModelId = listKit.pop();
//
// 	modelIdList.wire("modelIds->list", popModelId);
// 	popModelId.wire("item->model", transformer);
// 	popModelId.wire("list", popModelId);
//
// 	transformer.wire("*", board.output({ $id: "result" }));
// 	transformer.wire("->$error", output)
//
// 	makeMarkdown({
// 		board,
// 		title: "Xenova",
// 		dir: "./tests/kits/xenovaKit",
// 		filename: "Xenova",
// 		markdownConfig: [MarkdownContentType.mermaid, MarkdownContentType.json],
// 	});
//
// 	const outputBuffer = [];
// 	const collectedModels: Map<string, Model> = new Map();
// 	for await (const run of board.run({
// 	})) {
// 		if (run.type === "output") {
// 			if (run.node.id === "models") {
// 				const models = run.outputs.list as Model[];
// 				for (const model of models) {
// 					collectedModels.set(model.id, model);
// 				}
// 			}
// 			outputBuffer.push({
// 				nodeId: run.node.id,
// 				...run.outputs,
// 			});
// 		}
// 	}
// 	// convert collectedModels to array, sort by downloads, and write to file
// 	fs.writeFileSync("./tests/kits/xenovaKit/models.json", JSON.stringify([...collectedModels.values()]
// 		.sort((a, b) => b.downloads - a.downloads)
// 		.map(m => {
// 			return {
// 				id: m.id,
// 				pipeline_tag: m.pipeline_tag,
// 				tags: m.tags.filter((t: string) => t == "text-classification" || t == "summarization" || t == "document-question-answering") || undefined,
// 			};
// 		})
// 	, null, 2));
//
// 	fs.writeFileSync("./tests/kits/xenovaKit/output.json", JSON.stringify(outputBuffer, null, 2));
// 	t.is(true, true)
// })


const TIMEOUT = 50_000  // 50 seconds;

test("getModels fetches models from API", async (t) => {
	t.timeout(TIMEOUT);
	const params: GetModelsParams = {
		sort: SortModels.downloads,
		direction: Direction.DESCENDING,
		filter: "transformers.js",
	};

	// Act
	const result = await getModels(params);

	const model = result.models[0];

	console.log({
		url: result.url,
		models: model,
	});

	// Assert
	t.true(Array.isArray(result.models));

	// Basic check, adjust according to actual expected output
	t.deepEqual(result, {models: result.models, url: result.url});

	t.true(result.models.length > 0);
});

// can get onnx model
test("getModels fetches onnx models from API", async (t) => {
	t.timeout(TIMEOUT);
	const params: GetModelsParams = {
		sort: SortModels.downloads,
		direction: Direction.DESCENDING,
		filter: "onnx",
	};

	// Act
	const result = await getModels(params);

	const model = result.models[0];

	console.log({
		url: result.url,
		models: model,
	});

	// Assert
	t.true(Array.isArray(result.models));

	// Basic check, adjust according to actual expected output
	t.deepEqual(result, {models: result.models, url: result.url});

	t.true(result.models.length > 0);
});

// can get models with config
test("getModels fetches models with config from API", async (t) => {
	t.timeout(TIMEOUT);
	const params: GetModelsParams = {
		sort: SortModels.downloads,
		direction: Direction.DESCENDING,
		filter: "transformers.js",
		config: true,
	};

	// Act
	const result = await getModels(params);

	const model = result.models[0];

	console.log({
		url: result.url,
		models: model,
	});

	// Assert
	t.true(Array.isArray(result.models));

	// Basic check, adjust according to actual expected output
	t.deepEqual(result, {models: result.models, url: result.url});

	t.true(result.models.length > 0);

	// is of type ModelWithConfig
	t.true("config" in model);
});

// can get full models
test("getModels fetches full models from API", async (t) => {
	t.timeout(TIMEOUT);
	const params: GetModelsParams = {
		sort: SortModels.downloads,
		direction: Direction.DESCENDING,
		filter: "transformers.js",
		full: true,
	};

	// Act
	const result = await getModels(params);

	const model = result.models[0];

	console.log({
		url: result.url,
		models: model,
	});

	// Assert
	t.true(Array.isArray(result.models));

	// Basic check, adjust according to actual expected output
	t.deepEqual(result, {models: result.models, url: result.url});

	t.true(result.models.length > 0);

	// is of type FullModel
	t.true("author" in model);
	t.true("lastModified" in model);
	t.true("sha" in model);
	t.true("library_name" in model);
	t.true("siblings" in model);
});

test("getModels fetches full models with config from API", async (t) => {
	t.timeout(TIMEOUT);
	const params: GetModelsParams = {
		sort: SortModels.downloads,
		direction: Direction.DESCENDING,
		filter: "transformers.js",
		full: true,
		config: true,
	};

	// Act
	const result = await getModels(params);

	const model = result.models[0];

	console.log({
		url: result.url,
		models: model,
	});

	// Assert
	t.true(Array.isArray(result.models));

	// Basic check, adjust according to actual expected output
	t.deepEqual(result, {models: result.models, url: result.url});

	t.true(result.models.length > 0);

	// is of type FullModelWithConfig
	t.true("author" in model);
	t.true("lastModified" in model);
	t.true("sha" in model);
	t.true("library_name" in model);
	t.true("siblings" in model);
	t.true("config" in model);
});

// get and test summarization model
test("getModels fetches summarization models from API", async (t) => {
	t.timeout(TIMEOUT);
	const result = await getModels({
		direction: Direction.DESCENDING,
		filter: "transformers.js",
	});

	const model = result.models
		.sort((a, b) => b.likes - a.likes)
		.filter((m) => m.pipeline_tag == TransformerTask.summarization)[0];

	console.log({
		url: result.url,
		models: model,
	});

	const pipelineResult = await runPipeline({
		input: "I say to you today, my friends, so even though we face the difficulties of today and tomorrow, I still have a dream. It is a dream deeply rooted in the American dream. I have a dream that one day this nation will rise up and live out the true meaning of its creed: 'We hold these truths to be self-evident, that all men are created equal.",
		model: model.id,
		task: TransformerTask.summarization,
	});

	console.log({
		...pipelineResult,
	});

	// Assert pipeline result
	t.true(pipelineResult.output.length > 0);
});

// get and test text classification model
test("getModels fetches text classification models from API", async (t) => {
	t.timeout(TIMEOUT);
	const result = await getModels({
		sort: SortModels.downloads,
		direction: Direction.DESCENDING,
		filter: "transformers.js",
	});

	const model = result.models
		.sort((a, b) => b.likes - a.likes)
		.filter((m) => m.pipeline_tag == TransformerTask.textClassification)[0];

	console.log({
		url: result.url,
		models: model,
	});

	const pipelineResult = await runPipeline({
		input: "Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.",
		model: model.id,
		task: TransformerTask.textClassification,
	});

	console.log({
		...pipelineResult,
	});

	// Assert pipeline result
	t.true(pipelineResult.output.length > 0);
});

// SortModels.downloads Direction.DESCENDING works as expected
test("getModels fetches models sorted by downloads", async (t) => {
	t.timeout(TIMEOUT);
	const result = await getModels({
		sort: SortModels.downloads,
		direction: Direction.DESCENDING,
		filter: "transformers.js",
	});

	const models = result.models;

	t.true(models.length > 0);

	// is sorted by downloads
	t.true(models[0].downloads > models[1].downloads);
});

// SortModels.createdAt Direction.DESCENDING works as expected
test("getModels fetches models sorted by createdAt", async (t) => {
	t.timeout(TIMEOUT);
	const result = await getModels({
		sort: SortModels.createdAt,
		direction: Direction.DESCENDING,
		filter: "transformers.js",
	});

	const models = result.models;

	t.true(models.length > 0);

	// is sorted by createdAt
	t.true(new Date(models[0].createdAt) > new Date(models[1].createdAt));
});
