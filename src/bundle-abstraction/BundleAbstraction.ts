import { ProducerAbstraction } from "./ProducerAbstraction";
import { PackageAbstraction } from "./PackageAbstraction";

export class BundleAbstraction {
    public packageAbstractions = new Map<string, PackageAbstraction​​>();
    constructor(public name: string, public producerAbstraction: ProducerAbstraction) {
        producerAbstraction.registerBundleAbstraction(this);
    }

    public registerPackageAbstraction(packageAbstraction: PackageAbstraction​​) {
        this.packageAbstractions.set(packageAbstraction.name, packageAbstraction);
    }


}

