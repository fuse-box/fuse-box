const CACHED_PATHS = new Map<string, RegExp>();
export function path2Regex(path: string) {
	if (CACHED_PATHS.get(path)) {
		return CACHED_PATHS.get(path);
	}
	path = path.replace(/(\.|\/)/, "\\$1");

	const re = new RegExp(path);
	CACHED_PATHS.set(path, re);
	return re;
}
