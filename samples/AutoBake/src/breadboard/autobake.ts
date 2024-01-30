import { ClaudeKit, ConfigKit, ObjectKit, StringKit } from "@exadev/breadboard-kits/src";
import { generateAndWriteCombinedMarkdown } from "@exadev/breadboard-kits/src/util/files/generateAndWriteCombinedMarkdown.js";
import { Board } from "@google-labs/breadboard";
import Core from "@google-labs/core-kit"
import fs from "fs"
import path from "path";
import { FeatureKit } from "~/breadboard/featurekit.js";

const board: Board = new Board({title: "AutoBake"});
const featureKit: FeatureKit = board.addKit(FeatureKit);
const claudeKit: ClaudeKit = board.addKit(ClaudeKit);
const stringKit: StringKit = board.addKit(StringKit);
const config: ConfigKit = board.addKit(ConfigKit);

const features = featureKit.chromeStatusApiFeatures({$id: "chromeApiFeatures"});

const serverUrl = "https://api.anthropic.com/v1/complete";
const claudeParams = {
	model: "claude-2",
	url: `${serverUrl}`,
};

const claudeCompletion = claudeKit.generateCompletion({
	$id: "claudeAPI",
	...claudeParams,
});

const prompt = [
	"Create a markdown document that can be used to teach a junior developer about the feature discussed in the `feature` code block.",
	"Base the script on the content of the `resources` code block.",
	"The first line of the document should be a heading with the name of the feature.",
	"\n",
	"Provide your response formatted as raw markdown.",
	"Only respond with the result of this request.",
	"Do not add any additional information to the script",
	"\n",
	"```resources",
	"{{resources}}",
	"```",
	"\n",
	"```feature",
	"{{feature}}",
	"```",
].join("/n");
const instructionTemplate = stringKit.template({
	$id: "claudePromptConstructor",
	template: prompt,
});

const claudeApiKey = config.readEnvVar({
	$id: "getClaudeAPIKey",
	key: "CLAUDE_API_KEY"
});
const llm = board.addKit(Core)
//TODO refactor to take feature ID as a board input

type identifiable = { id: number }
type identifiableArray = identifiable[]

const selectRandom = llm.runJavascript({
	$id: "selectRandom",
	raw: true,
	code: (function run({list}: { list: identifiableArray }): {
		id: number,
		selected: identifiable,
		list: identifiableArray
	} {
		const selected = list[Math.floor(Math.random() * list.length)]
		return {id: selected.id, selected, list}
	}).toString()
})
const objectKit = board.addKit(ObjectKit)
const spread = objectKit.spread()

// features.wire("*",board.output())
features.wire("features->object", spread)
// spread.wire("features", board.output())
spread.wire("features->list", selectRandom);
selectRandom.wire("selected", board.output({$id: "selectedFeature"}));
const getFeatureContent = featureKit.getResourcesForFeature({$id: "getResourcesForFeature"});
selectRandom.wire("selected->feature", getFeatureContent);
getFeatureContent.wire("resources", board.output({$id: "resources"}));

function filterAttributes(obj: any) {
	// recursively remove any falsy attributes

	if (!obj) {
		return
	} else if (typeof obj === "object") {
		const newObj: any = {}
		for (const [key, value] of Object.entries(obj)) {
			const newValue = filterAttributes(value)
			if (newValue) {
				newObj[key] = newValue
			}
		}
		if (Object.keys(newObj).length > 0) {
			return newObj
		} else {
			return
		}
	}
	// 	if array
	else if (Array.isArray(obj)) {
		const newArray: any[] = []
		for (const value of obj) {
			const newValue = filterAttributes(value)
			if (newValue) {
				newArray.push(newValue)
			}
		}
		return newArray
	}
	return obj
}

const recursivelyFilterEmptyAttributes = llm.runJavascript({
	name: "filterAttributes",
	code: filterAttributes.toString(),
	raw: true
})

// selectRandom.wire("selected->feature", instructionTemplate)
selectRandom.wire("selected->feature", recursivelyFilterEmptyAttributes)
recursivelyFilterEmptyAttributes.wire("feature", board.output({$id: "filteredFeature"}))
recursivelyFilterEmptyAttributes.wire("feature", instructionTemplate)

getFeatureContent.wire("resources", instructionTemplate)
instructionTemplate.wire("string", board.output({$id: "prompt"}));
claudeApiKey.wire("CLAUDE_API_KEY", claudeCompletion);
instructionTemplate.wire("string->text", claudeCompletion);
const claudeOutput: any = board.output({$id: "claudeOutput"});
recursivelyFilterEmptyAttributes.wire("feature", claudeOutput);
claudeCompletion.wire("completion", claudeOutput);

// const result = await board.runOnce({});
generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
	dir: "./"
});

fs.writeFileSync("board.json", JSON.stringify(board, null, "\t"));

(async () => {
	for await (const runResult of board.run({})) {
		if (runResult.type === "input") {

		} else if (runResult.type === "output") {
			console.log(runResult.node.id, runResult.outputs);
			if (runResult.node.id === "claudeOutput") {
				const feature = runResult.outputs.feature
				const featureId = feature["id"]
				const featureName = feature["name"]
				const dest: string = `./output/${featureId}.md`
				fs.mkdirSync(path.dirname(dest), {recursive: true})
				const content = [,
					runResult.outputs.completion as string,
					"---",
					`[${featureId}: ${featureName}](https://chromestatus.com/feature/${featureId})`,
				].join("\n\n")
				fs.writeFileSync(dest, content);
				console.log("Wrote to", dest);
			}
		}
	}
})();
