export function unescapeHtml(str: string): string {
	return str.replace(/&(#?\w+);/g, (_match, p1) => {
		const charCode = p1.startsWith("#")
			? parseInt(p1.slice(1), 16)
			: decodeURI(p1);
		return String.fromCharCode(typeof charCode === "number" ? charCode : 0);
	});
}