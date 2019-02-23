import * as path from "path";
import * as ts from "typescript";
import { ensurePublicExtension, extractFuseBoxPath } from "../Utils";

export interface IResolverProps {
	homeDir?: string;
	filePath?: string;
	target: string;
	package?: IResolverPackage;
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

function makeFuseBoxPath(homeDir: string, absPath: string) {
	return homeDir && ensurePublicExtension(extractFuseBoxPath(homeDir, absPath));
}

export function resolveModule(props: IResolverProps): Partial<IResolver> {
	const external = isExternalModule(props);
	if (external) {
		return external;
	}
	let forcedStatement: string;
	let alias: string;
	let packageJSONPath: string;
	let forceReplacement = false;

	function fileExists(fileName: string): boolean {
		return ts.sys.fileExists(fileName);
	}

	function readFile(fileName: string): string | undefined {
		const baseName = path.basename(fileName);

		const contents = ts.sys.readFile(fileName);
		if (baseName === "package.json") {
			console.log(fileName);
			packageJSONPath = fileName;
			forceReplacement = true;
		}
		return contents;
	}

	const response = ts.resolveModuleName(
		props.target,
		props.filePath,
		{ allowJs: true },
		{
			fileExists,
			readFile,
		},
	);
	const resolved = response.resolvedModule;
	if (!resolved) {
		return;
	}

	let pkg: IResolverPackage;
	if (resolved.isExternalLibraryImport && resolved.packageId) {
		// drop force replacement, as it's coming naturally without an override
		forceReplacement = false;
		pkg = {
			name: resolved.packageId.name,
			version: resolved.packageId.version,
			packageJSONLocation: packageJSONPath,
		};
	}

	const extension = resolved.extension;
	const absPath = resolved.resolvedFileName;
	const fuseBoxPath = makeFuseBoxPath(pkg ? path.dirname(pkg.packageJSONLocation) : props.homeDir, absPath);

	if (forceReplacement) {
		forcedStatement = `~/${fuseBoxPath}`;
	}
	return {
		alias,
		package: pkg,
		extension,
		absPath,
		fuseBoxPath,
		forcedStatement,
	};
}
