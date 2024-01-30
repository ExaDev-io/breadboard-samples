import fs from "fs";
import path from "path";

export function writeJson(
	{ dir = "", filename, jsonContent }: { dir: string, filename: string, jsonContent: string; }
) {
	const jsonFilePath = path.resolve(path.join(dir, "json", `${filename}.json`));
	fs.mkdirSync(path.dirname(jsonFilePath), { recursive: true });
	fs.writeFileSync(jsonFilePath, jsonContent);
	console.log("wrote", `"${jsonFilePath}"`);
}

export type writeJson = typeof writeJson;
export default writeJson;
