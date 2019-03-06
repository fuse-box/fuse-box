import * as fs from "fs";
import * as fsExtra from "fs-extra";
import { ensurePublicExtension, extractFuseBoxPath } from "../Utils";

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

export function fileExists(file: string) {
	return fs.existsSync(file);
}

export function ensureDir(dir: string) {
	fsExtra.ensureDirSync(dir);
}
export function makeFuseBoxPath(homeDir: string, absPath: string) {
	return homeDir && ensurePublicExtension(extractFuseBoxPath(homeDir, absPath));
}
