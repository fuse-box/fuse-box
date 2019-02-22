export interface IResolverProps {
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
export function resolveModule(props: IResolverProps): IResolver {
	return;
}
