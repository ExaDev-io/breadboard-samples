import type { JestConfigWithTsJest } from "ts-jest";
// https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/
const jestConfig: JestConfigWithTsJest = {
	preset: "ts-jest/presets/default-esm",
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	transform: {
		"^.*\\.(m?[tj]sx?)$": [
			"ts-jest",
			{
				useESM: true,
			},
		],
	},
	bail: false,
	maxWorkers: 1,
	detectOpenHandles: true,
	roots: ["__tests__/jest"],
};

export default jestConfig;
