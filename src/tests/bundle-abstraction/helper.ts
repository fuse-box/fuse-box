import { ProducerAbstraction } from "../../bundle-abstraction/ProducerAbstraction";
import { PackageAbstraction } from "../../bundle-abstraction/PackageAbstraction";
import { BundleAbstraction } from "../../bundle-abstraction/BundleAbstraction";
import { FileAbstraction } from "../../bundle-abstraction/FileAbstraction";

export function createAbstractFile(name: string) {
    let producerAbstraction = new ProducerAbstraction();
    let bundleAbstraction = new BundleAbstraction("app", producerAbstraction)
    let packageAbstraction = new PackageAbstraction("default", bundleAbstraction);
    return new FileAbstraction(name, packageAbstraction)
}

export function createDefaultPackageAbstraction(map: Map<string, string>): PackageAbstraction {
    let producerAbstraction = new ProducerAbstraction();
    let bundleAbstraction = new BundleAbstraction("app", producerAbstraction)
    let packageAbstraction = new PackageAbstraction("default", bundleAbstraction);
    map.forEach((contents, filepath) => {
        const file = new FileAbstraction(filepath, packageAbstraction)
        file.loadString(contents);
    });
    return packageAbstraction;
}