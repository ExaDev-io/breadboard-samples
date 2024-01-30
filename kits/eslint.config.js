/**
 * @type {import('eslint').Linter.Config}
 */
const config = [
	{
		files: ["src/**/*.ts"],
		ignores: ["ava.config.mjs", "eslint.config.js"],
		extends: [
			"eslint:recommended",
			// "plugin:@typescript-eslint/recommended",
			"plugin:@typescript-eslint/recommended-type-checked",
			"plugin:editorconfig/all",
		],
		parser: "@typescript-eslint/parser",
		parserOptions: {
			project: true,
			tsconfigRootDir: "__dirname",
		},
		plugins: ["@typescript-eslint", "editorconfig"],
		root: true,
		rules: {
			indent: ["error", "tab"],
			quotes: ["error", "double"],
		},
	},
];

export default config;
