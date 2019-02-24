import * as fs from "fs";
import { fileLookup, ILookupResult } from "./fileLookup";

interface IPathsLookupProps {
	homeDir: string;
	baseURL: string;
	cachePaths?: boolean;
	paths?: { [key: string]: Array<string> };
	target: string;
}

type DirectoryListing = Array<{ nameWithoutExtension: string; name: string }>;
type TypescriptPaths = Array<(target: string) => Array<string>>;
const CACHED_LISTING: { [key: string]: DirectoryListing } = {};
const CACHED_PATHS: { [key: string]: TypescriptPaths } = {};
/**
 "paths": {
			"@app/*": ["app/*"],
			"@config/*": ["app/_config/*"],
			"@environment/*": ["environments/*"],
			"@shared/*": ["app/_shared/*"],
			"@helpers/*": ["helpers/*"]
	}
 */

function pathRegex(input: string) {
	const str = input.replace(/\*/, "(.*)").replace(/[\-\[\]\/\{\}\+\?\\\^\$\|]/g, "\\$&");
	return new RegExp(`^${str}`);
}

/**
 * Compile a list of functions to easily test directories
 *
 * @param {string} homeDir
 * @param {{ [key: string]: Array<string> }} [paths]
 * @returns
 */
function getPathsData(props: IPathsLookupProps): TypescriptPaths {
	if (CACHED_PATHS[props.homeDir] && props.cachePaths) {
		return CACHED_PATHS[props.homeDir];
	}
	const fns: TypescriptPaths = [];
	for (const key in props.paths) {
		fns.push((target: string) => {
			const re = pathRegex(key);

			const matched = target.match(re);
			if (matched) {
				const variable = matched[1];
				const directories = props.paths[key];
				return directories.map(item => item.replace(/\*/, variable));
			}
		});
	}
	if (props.cachePaths) {
		CACHED_PATHS[props.homeDir] = fns;
	}

	return fns;
}

function getIndexFiles(props: IPathsLookupProps): DirectoryListing | undefined {
	let indexFiles: Array<{ nameWithoutExtension: string; name: string }>;
	if (props.baseURL === props.homeDir) {
		if (CACHED_LISTING[props.homeDir]) {
			indexFiles = CACHED_LISTING[props.homeDir];
		} else {
			const files = [];
			fs.readdirSync(props.baseURL).forEach(file => {
				if (file[0] !== ".") {
					const [nameWithoutExtension] = file.split(".");
					files.push({
						nameWithoutExtension,
						name: file,
					});
				}
			});
			indexFiles = CACHED_LISTING[props.homeDir] = files;
		}
	}
	return indexFiles;
}
export function pathsLookup(props: IPathsLookupProps): ILookupResult {
	// if baseDir is the same as homeDir we can assume aliasing directories
	// and files without the need in specifying "paths"
	// so we check if first
	const indexFiles = getIndexFiles(props);
	if (indexFiles) {
		for (const i in indexFiles) {
			const item = indexFiles[i];
			// check if starts with it only
			const regex = new RegExp(`^${item.nameWithoutExtension}($|\\.|\\/)`);
			if (regex.test(props.target)) {
				const result = fileLookup({ fileDir: props.homeDir, target: props.target });
				if (result && result.fileExists) {
					return result;
				}
			}
		}
	}

	const items = getPathsData(props);
	for (const i in items) {
		const test = items[i];
		const directories = test(props.target);

		if (directories) {
			for (const j in directories) {
				const directory = directories[j];
				const result = fileLookup({ fileDir: props.homeDir, target: directory });
				if (result && result.fileExists) {
					return result;
				}
			}
		}
	}
}
