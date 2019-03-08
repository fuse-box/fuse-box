import {
	ICacheAdapter,
	ICacheTreeContents,
	ICachePackage,
	ICacheRequest,
	ICachePackageContent,
	ICacheResponse,
} from "./Interfaces";

export function getPackageCacheKey(name: string, version: string) {
	return `${name}-${version}.json`;
}
export class Cache {
	private tree: ICacheTreeContents;
	constructor(public adapter: ICacheAdapter) {
		this.tree = getTree(adapter);
	}

	public findPackage(name: string, version: string): ICachePackage {
		const record = this.tree.packages[name];
		return record && record[version];
	}

	public syncPackage(props: ICachePackage, content: ICachePackageContent): { key: string } {
		const pkg = (this.tree.packages[props.name] = this.tree.packages[name] || {});
		pkg[props.version] = props;
		const key = getPackageCacheKey(props.name, props.version);
		this.adapter.set(getPackageCacheKey(props.name, props.version), content);
		return { key };
	}

	public resolve(props: ICacheRequest): ICacheResponse {
		const response: ICacheResponse = [];

		const pkg = this.findPackage(props.name, props.version);
		if (!pkg) {
			// package record wasn't found at all
			return;
		}
		const packageJson = require(pkg.packageJSONLocation);

		// break if package.json version has changed
		packageJson.version = packageJson.version || "1.0.0";
		if (packageJson.version !== props.version) {
			return;
		}

		for (const mod in props.forModules) {
			const name = props.forModules[mod];
			if (!pkg.modules.includes(name)) {
				// requested file was not found in the records
				return;
			}
		}

		const dependentPackages: Array<ICachePackage> = [];
		if (pkg.dependencies) {
			for (const item in pkg.dependencies) {
				const dependency = pkg.dependencies[item];
				const dependentPackage = this.findPackage(dependency.name, dependency.version);
				if (!dependentPackage) {
					// requested package wasn't found in the depedencny
					return;
				}

				dependentPackages.push(dependentPackage);
			}
		}
		response.push({
			content: this.adapter.get<ICachePackageContent>(getPackageCacheKey(props.name, props.version)),
			meta: pkg,
		});

		dependentPackages.forEach(dep => {
			response.push({
				content: this.adapter.get<ICachePackageContent>(getPackageCacheKey(dep.name, dep.version)),
				meta: dep,
			});
		});

		return response;
	}
}

export function getTree(adapter: ICacheAdapter): ICacheTreeContents {
	const tree = adapter.ensure<ICacheTreeContents>("tree.json");
	if (!tree.packages) {
		tree.packages = {};
	}
	return tree;
}

export function getCache(adapter: ICacheAdapter) {
	return new Cache(adapter);
}
