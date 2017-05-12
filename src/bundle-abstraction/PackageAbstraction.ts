import { BundleAbstraction } from "./BundleAbstraction";
import { FileAbstraction } from "./FileAbstraction";

export class PackageAbstraction {
    public fileAbstractions = new Map<string, FileAbstraction>();
    constructor(public name: string, public bundleAbstraction: BundleAbstraction) {
        bundleAbstraction.registerPackageAbstraction(this);
    }

    public registerFileAbstraction(fileAbstraction: FileAbstraction) {
        this.fileAbstractions.set(fileAbstraction.fuseBoxPath, fileAbstraction);
    }
}