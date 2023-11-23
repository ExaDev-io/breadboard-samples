// @/src/utils.ts
export const blockingFunc = () => {
	new Array(100_000_000)
		.map((elm, index) => elm + index)
		.reduce((acc, cur) => acc + cur, 0);
};