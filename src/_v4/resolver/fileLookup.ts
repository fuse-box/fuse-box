import * as path from "path";
import * as fs from "fs";

export interface ILookupProps {
	typescriptFirst?: boolean;
	javascriptFirst?: boolean;
	fileDir?: string;
	filePath?: string;
	target: string;
}

export interface ILookupResult {
	isDirectoryIndex?: boolean;
	fileExists: boolean;
	absPath: string;
	extension?: string;

	customIndex?: boolean;
}

const JS_INDEXES = ["index.js", "index.jsx"];
const TS_INDEXES = ["index.ts", "index.tsx"];
const TS_INDEXES_FIRST = [...TS_INDEXES, ...JS_INDEXES];
const JS_INDEXES_FIRST = [...JS_INDEXES, ...TS_INDEXES];

const JS_EXTENSIONS = [".js", ".jsx"];
const TS_EXTENSIONS = [".ts", ".tsx"];

const TS_EXTENSIONS_FIRST = [...TS_EXTENSIONS, ...JS_EXTENSIONS];
const JS_EXTENSIONS_FIRST = [...JS_EXTENSIONS, ...TS_EXTENSIONS];

function tryIndexes(target: string, indexes: Array<string>) {
	for (const i in indexes) {
		const indexFile = indexes[i];
		const resolved = path.join(target, indexFile);
		if (fs.existsSync(resolved)) {
			return resolved;
		}
	}
}

function tryExtensions(target: string, extensions: Array<string>) {
	for (const i in extensions) {
		const resolved = `${target}${extensions[i]}`;
		if (fs.existsSync(resolved)) {
			return resolved;
		}
	}
}
export function getFolderEntryPointFromPackageJSON(json: any) {
	if (json.module) {
		return json.module;
	}
	if (json.tsMain) {
		return json.tsMain;
	}
	if (json["jsnext:main"]) {
		return json["jsnext:main"];
	}
	return json.main;
}

export function fileLookup(props: ILookupProps): ILookupResult {
	if (!props.fileDir && !props.filePath) {
		throw new Error("Failed to lookup. Provide either fileDir or filePath");
	}
	let resolved = path.join(props.filePath ? path.dirname(props.filePath) : props.fileDir, props.target);
	const extension = path.extname(resolved);

	if (extension) {
		return {
			extension: path.extname(resolved),
			absPath: resolved,
			fileExists: fs.existsSync(resolved),
		};
	}

	// try files without extensions first
	let fileExtensions: Array<string> = TS_EXTENSIONS_FIRST;
	if (props.javascriptFirst) {
		fileExtensions = JS_EXTENSIONS_FIRST;
	}
	if (props.typescriptFirst) {
		fileExtensions = TS_EXTENSIONS_FIRST;
	}
	const targetFile = tryExtensions(resolved, fileExtensions);
	if (targetFile) {
		return {
			absPath: targetFile,
			extension: path.extname(targetFile),
			fileExists: true,
		};
	}

	let isDirectory: boolean;
	// try directory indexes
	const exists = fs.existsSync(resolved);
	if (exists) {
		const stat = fs.lstatSync(resolved);
		if (stat.isDirectory) {
			isDirectory = true;
			let indexes: Array<string> = TS_INDEXES_FIRST;
			if (props.javascriptFirst) {
				indexes = JS_INDEXES_FIRST;
			}
			if (props.typescriptFirst) {
				indexes = TS_INDEXES_FIRST;
			}
			const directoryIndex = tryIndexes(resolved, indexes);
			if (directoryIndex) {
				return {
					isDirectoryIndex: true,
					absPath: directoryIndex,
					extension: path.extname(directoryIndex),
					fileExists: true,
				};
			}
			// only in case of a directory
			const packageJSON = path.join(resolved, "package.json");
			if (fs.existsSync(packageJSON)) {
				const entry = getFolderEntryPointFromPackageJSON(require(packageJSON));
				const entryFile = path.join(resolved, entry);
				return {
					customIndex: true,
					isDirectoryIndex: true,
					absPath: entryFile,
					extension: path.extname(entryFile),
					fileExists: fs.existsSync(entryFile),
				};
			}
		}
	}

	// as a last resort, we should try ".json" which is a very rare case
	// that's why it has the lowest priority here
	if (!isDirectory) {
		const targetFile = tryExtensions(resolved, [".json"]);
		if (targetFile) {
			return {
				customIndex: true, // it still needs to be re-written because FuseBox client API won't find it
				absPath: targetFile,
				extension: path.extname(targetFile),
				fileExists: true,
			};
		}
	}
	return {
		fileExists: false,
		absPath: resolved,
	};
}
