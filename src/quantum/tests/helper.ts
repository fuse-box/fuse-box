import { ProducerAbstraction } from "../core/ProducerAbstraction";
import { BundleAbstraction } from "../core/BundleAbstraction";
import { PackageAbstraction } from "../core/PackageAbstraction";
import { FileAbstraction } from "../core/FileAbstraction";

export function createAbstractFile(name: string) {
    let producerAbstraction = new ProducerAbstraction();
    let bundleAbstraction = new BundleAbstraction("app")
    producerAbstraction.registerBundleAbstraction(bundleAbstraction);
    let packageAbstraction = new PackageAbstraction("default", bundleAbstraction);
    return new FileAbstraction(name, packageAbstraction)
}

export function createDefaultPackageAbstraction(map: Map<string, string>): PackageAbstraction {
    let producerAbstraction = new ProducerAbstraction();
    let bundleAbstraction = new BundleAbstraction("app")
    producerAbstraction.registerBundleAbstraction(bundleAbstraction);
    let packageAbstraction = new PackageAbstraction("default", bundleAbstraction);
    map.forEach((contents, filepath) => {
        const file = new FileAbstraction(filepath, packageAbstraction)
        file.loadString(contents);
    });
    return packageAbstraction;
}

export function createBundleAbstraction(obj: any): BundleAbstraction {
    let producerAbstraction = new ProducerAbstraction();
    let bundleAbstraction = new BundleAbstraction("app")
    producerAbstraction.registerBundleAbstraction(bundleAbstraction);

    for (let pgkName in obj) {
        let packageAbstraction = new PackageAbstraction(pgkName, bundleAbstraction);
        const pkgObj = obj[pgkName];;
        const files = pkgObj.files || {};
        for (let filepath in files) {
            const file = new FileAbstraction(filepath, packageAbstraction)
            file.loadString(files[filepath]);
        }
    }
    return bundleAbstraction;
}