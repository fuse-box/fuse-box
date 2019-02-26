import { IResolverProps } from "./resolver";
import * as appRoot from "app-root-path";
import * as path from "path";
import * as fs from "fs";

const PROJECT_NODE_MODULES = path.join(appRoot.path, "node_modules");

function findPackageRoot(fileName: string) {
	const dir = path.dirname(fileName);
	const lastIndex = dir.lastIndexOf("node_modules");
	return dir.substring(0, lastIndex);
}

function getPrimaryModule(props: IResolverProps) {
	const targetPath = path.join(PROJECT_NODE_MODULES, props.target);
	if (fs.existsSync(targetPath)) {
		return targetPath;
	}
}
export function findTargetFolder(props: IResolverProps, folders?: Array<string>): string {
	folders = folders || [];

	// test primary node_module

	for (const i in folders) {
		const folder = folders[i];
		const targetPath = path.join(folder, props.target);
		if (targetPath && fs.existsSync(targetPath)) {
			return targetPath;
		}
	}

	// to simplify the lookup we need to check how relative the file is compared
	// to the primary node_modules. If we going out from it, that means that we are sill in the project
	const relativePrimary = path.relative(PROJECT_NODE_MODULES, props.filePath);
	if (/\.\./.test(relativePrimary)) {
		const targetPath = getPrimaryModule(props);
		if (targetPath) {
			return targetPath;
		}
	} else {
		const packageRoot = findPackageRoot(props.filePath);
		console.log(props.filePath, packageRoot);

		// console.log(props.filePath);
		// console.log(path.join(props.filePath, "../"));
		// otherwise we are inside the node_modules, which means we shoudl
		// traverse back until we find node_modules/[lib] and try finding node_modules underneath it,
		// otherwise we drop back to the primary node_module
	}
}
export function nodeModuleLookup(props: IResolverProps) {
	const DIRS = [PROJECT_NODE_MODULES];
	props.target;
}
