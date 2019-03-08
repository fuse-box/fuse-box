import { makeFuseBoxPath, path2Regex } from "../utils/utils";
import { fileLookup, ILookupResult } from "./fileLookup";
import { isNodeModule, nodeModuleLookup, INodeModuleLookup } from "./nodeModuleLookup";
import { pathsLookup } from "./pathsLookup";
import { isServerPolyfill, isElectronPolyfill } from "./polyfills";

export interface IResolverProps {
	buildTarget?: "browser" | "server" | "electron" | "universal";
	// user string
	target: string;
	cache?: boolean;
	homeDir?: string;
	filePath?: string;
	packageMeta?: IPackageMeta;
	modules?: Array<string>;
	alias?: {
		[key: string]: string;
	};
	typescriptPaths?: {
		baseURL: string;
		paths?: { [key: string]: Array<string> };
	};
}

export interface IPackageMeta {
	name: string;
	entryAbsPath?: string;
	entryFuseBoxPath?: string;
	version?: string;
	packageRoot?: string;
	packageJSONLocation?: string;
	// https://github.com/defunctzombie/package-browser-field-spec
	browser?: { [key: string]: string | boolean } | string;
}

export interface IResolver {
	// skip bundling
	skip?: boolean;
	// external e.g. http://something.com/main.css
	isExternal?: boolean;
	// e.g ".css" ".js"
	extension?: string;

	// this is resolved one from the main project and passed later as IResolverProps.package
	package?: INodeModuleLookup;

	// resolved absolute path
	absPath?: string;
	// make sure that it's a public path. E.g "components/MyComponent.jsx"
	// tsx and ts needs to be replaced with js and jsx
	fuseBoxPath?: string;

	forcedStatement?: string;
}

function isExternalModule(props: IResolverProps): IResolver {
	if (/^https?:/.test(props.target)) {
		return {
			isExternal: true,
		};
	}
}

function replaceAliases(
	props: IResolverProps,
): {
	forceReplacement: boolean;
	target: string;
} {
	let forceReplacement = false;
	let target = props.target;
	for (const key in props.alias) {
		const regex = path2Regex(key);
		const value = props.alias[key];
		if (regex.test(target)) {
			target = target.replace(regex, value);
			return { target, forceReplacement: true };
		}
	}
	return { target, forceReplacement };
}

export function resolveModule(props: IResolverProps): IResolver {
	const external = isExternalModule(props);
	if (external) {
		return external;
	}
	const isBrowserBuild = props.buildTarget === "browser";
	const isServerBuild = props.buildTarget === "server";
	const isElectronBuild = props.buildTarget === "electron";
	let target = props.target;
	let forcedStatement: string;
	let forceReplacement = false;

	let lookupResult: ILookupResult;

	// replace aliaes
	// props.target will be updated
	if (props.alias) {
		const res = replaceAliases(props);
		forceReplacement = res.forceReplacement;
		target = res.target;
	}

	if (props.packageMeta) {
		if (isBrowserBuild && props.packageMeta.browser && typeof props.packageMeta.browser === "object") {
			// a match should direct according to the specs
			const browserReplacement = props.packageMeta.browser[props.target];
			if (browserReplacement !== undefined) {
				if (typeof browserReplacement === "string") {
					forcedStatement = target;
					target = browserReplacement;
				} else if (browserReplacement === false) {
					// library should be ignored
					target = "fuse-empty-package";
					forceReplacement = true;
				}
			}
		}
	}

	// handle typescript paths
	// in this cases it should always send a forceStatement
	if (props.typescriptPaths) {
		lookupResult = pathsLookup({
			baseURL: props.typescriptPaths.baseURL,
			cachePaths: props.cache,
			homeDir: props.homeDir,
			paths: props.typescriptPaths.paths,
			target: target,
		});
		if (lookupResult) {
			forceReplacement = true;
		}
	}

	// continue looking for the file
	if (!lookupResult) {
		const moduleParsed = isNodeModule(target);
		if (moduleParsed) {
			// first check if we need to bundle it at all;
			if (isServerBuild && isServerPolyfill(moduleParsed.name)) {
				return { skip: true };
			}
			if (isElectronBuild && isElectronPolyfill(moduleParsed.name)) {
				return { skip: true };
			}
			const pkg = nodeModuleLookup(props, moduleParsed);
			const aliasForced = forceReplacement && target;
			return {
				forcedStatement: pkg.forcedStatement ? pkg.forcedStatement : aliasForced,
				package: pkg,
			};
		} else {
			lookupResult = fileLookup({ filePath: props.filePath, target: target });
		}
	}

	if (!lookupResult.fileExists) {
		return;
	}
	if (lookupResult.customIndex) {
		forceReplacement = true;
	}

	const extension = lookupResult.extension;
	const absPath = lookupResult.absPath;
	const packageRoot = props.packageMeta ? props.packageMeta.packageRoot : props.homeDir;
	const fuseBoxPath = makeFuseBoxPath(packageRoot, absPath);

	if (forceReplacement) {
		if (props.packageMeta) {
			forcedStatement = `${props.packageMeta.name}/${fuseBoxPath}`;
		} else {
			forcedStatement = `~/${fuseBoxPath}`;
		}
	}
	return {
		extension,
		absPath,
		fuseBoxPath,
		forcedStatement,
	};
}
