/**
 * @type {import('ava').Config}
 */
const config = {
  extensions: {
    ts: "module",
  },
  files: ["__tests__/ava/**/*.ava.ts"],
  nodeArguments: ["--import=tsx"],
  workerThreads: false,
};

export default config;
