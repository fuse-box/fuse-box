import { BundleAbstraction } from "../../src/quantum/core/BundleAbstraction";
import { FileAbstraction } from "../../src/quantum/core/FileAbstraction";
import { PackageAbstraction } from "../../src/quantum/core/PackageAbstraction";
import { ProducerAbstraction } from "../../src/quantum/core/ProducerAbstraction";

export function createAbstractFile(name: string) {
	let producerAbstraction = new ProducerAbstraction();
	let bundleAbstraction = new BundleAbstraction("app");
	producerAbstraction.registerBundleAbstraction(bundleAbstraction);
	let packageAbstraction = new PackageAbstraction("default", bundleAbstraction);
	return new FileAbstraction(name, packageAbstraction);
}

export function createDefaultPackageAbstraction(map: Map<string, string>): PackageAbstraction {
	let producerAbstraction = new ProducerAbstraction();
	let bundleAbstraction = new BundleAbstraction("app");
	producerAbstraction.registerBundleAbstraction(bundleAbstraction);
	let packageAbstraction = new PackageAbstraction("default", bundleAbstraction);
	map.forEach((contents, filepath) => {
		const file = new FileAbstraction(filepath, packageAbstraction);
		file.loadString(contents);
	});
	return packageAbstraction;
}

export function createBundleAbstraction(obj: any): BundleAbstraction {
	let producerAbstraction = new ProducerAbstraction();
	let bundleAbstraction = new BundleAbstraction("app");
	producerAbstraction.registerBundleAbstraction(bundleAbstraction);

	for (let pgkName in obj) {
		let packageAbstraction = new PackageAbstraction(pgkName, bundleAbstraction);
		const pkgObj = obj[pgkName];
		const files = pkgObj.files || {};
		for (let filepath in files) {
			const file = new FileAbstraction(filepath, packageAbstraction);
			file.loadString(files[filepath]);
		}
	}
	return bundleAbstraction;
}
