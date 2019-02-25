import { ensurePublicExtension, extractFuseBoxPath } from "../../Utils";
import { fileLookup, ILookupProps, ILookupResult } from "./fileLookup";
import { pathsLookup } from "./pathsLookup";
import { path2Regex } from "../utils";

export interface IResolverProps {
	cache?: boolean;
	homeDir?: string;
	filePath?: string;
	target: string;
	package?: IResolverPackage;
	alias?: {
		[key: string]: string;
	};
	typescriptPaths?: {
		baseURL: string;
		paths?: { [key: string]: Array<string> };
	};
}

export interface IResolverPackage {
	name: string;
	// custom fusebox typescript entry
	tsMain?: string;
	main?: string;
	version?: string;
	packageJSONLocation?: string;
	// If a package is a part of another package under it's own node_modules
	// we need to set it to true. This will be used to bundle multiple version of the same package
	// and resolve conflicting version
	isFlat?: boolean;

	// https://github.com/defunctzombie/package-browser-field-spec
	browser?: { [key: string]: string | boolean };
}

export interface IResolver {
	// default is browser
	target?: "browser" | "server" | "electron";

	// external e.g. http://something.com/main.css
	isExternal?: boolean;
	// e.g ".css" ".js"
	extension?: string;

	// this is resolved one from the main project and passed later as IResolverProps.package
	package?: IResolverPackage;

	// if it's the entry point
	isPackageEntry?: boolean;

	// If user make a partial require (e.g require("foo/bar.js"))
	// isPackageEntry in this case should be false
	packagePartial?: boolean;

	// resolved absolute path
	absPath: string;
	// make sure that it's a public path. E.g "components/MyComponent.jsx"
	// tsx and ts needs to be replaced with js and jsx
	fuseBoxPath: string;

	forcedStatement?: string;

	/*
	 If a resolved module doesn't look like the original one this needs to tell us the difference
	 a resolved folder contains package.json which instead of index.js routes to foobar.js

	 Having an original request to resolve
	 {
		filePath : "lib/foo.js"
		target : "../some/path"
	 }
	 {
		 alias ; "~/some/path/foobar.js" // <-- in a simple case that should be "index.js"
	 }

	 It should also take into consideration modules. If it's a package then the alias should contain a full package name:
	 e.g "mypackage/some/path/foobar.js"

	 Another case is "browser" field
	 https://github.com/defunctzombie/package-browser-field-spec
	 if the target is browser, and the props were set to respect it (see package.browser)
	 Having:
	 "module-a": false

	 Should give us "fuse-empty-package" since it should be replaced with a placeholder
	*/
	alias?: string;
}

function isExternalModule(props: IResolverProps): Partial<IResolver> {
	if (/^https?:/.test(props.target)) {
		return {
			isExternal: true,
		};
	}
}

function isNodeModule(path: string) {
	return /^([a-z@](?!:).*)$/.test(path);
}

function makeFuseBoxPath(homeDir: string, absPath: string) {
	return homeDir && ensurePublicExtension(extractFuseBoxPath(homeDir, absPath));
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

export function resolveModule(props: IResolverProps): Partial<IResolver> {
	const external = isExternalModule(props);
	if (external) {
		return external;
	}
	let target = props.target;
	let forcedStatement: string;
	let alias: string;
	let packageJSONPath: string;
	let forceReplacement = false;

	let lookupResult: ILookupResult;

	// replace aliaes
	// props.target will be updated
	if (props.alias) {
		const res = replaceAliases(props);
		forceReplacement = res.forceReplacement;
		target = res.target;
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
		if (isNodeModule(target)) {
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

	// let pkg: IResolverPackage;
	// if (resolved.isExternalLibraryImport && resolved.packageId) {
	// 	// drop force replacement, as it's coming naturally without an override
	// 	forceReplacement = false;
	// 	pkg = {
	// 		name: resolved.packageId.name,
	// 		version: resolved.packageId.version,
	// 		packageJSONLocation: packageJSONPath,
	// 	};
	// }

	const extension = lookupResult.extension;
	const absPath = lookupResult.absPath;
	const fuseBoxPath = makeFuseBoxPath(props.homeDir, absPath);

	if (forceReplacement) {
		forcedStatement = `~/${fuseBoxPath}`;
	}
	return {
		alias,
		//package: pkg,
		extension,
		absPath,
		fuseBoxPath,
		forcedStatement,
	};
}
