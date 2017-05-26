import { BundleAbstraction } from "./BundleAbstraction";
import { generateFileCombinations } from "./utils";

export class ProducerAbstraction {
    public bundleAbstractions = new Map<string, BundleAbstraction>();

    public useNumbers = true;
    public useComputedRequireStatements = false;

    constructor() { }


    public registerBundleAbstraction(bundleAbstraction: BundleAbstraction) {
        this.bundleAbstractions.set(bundleAbstraction.name, bundleAbstraction);
    }



    public findFileAbstraction(packageName: string, resolvedPathRaw: string) {


        let combinations: string[] = generateFileCombinations(resolvedPathRaw);

        let requiredFileAbstraction;
        this.bundleAbstractions.forEach(bundle => {
            if (requiredFileAbstraction) return;

            const pkg = bundle.packageAbstractions.get(packageName);
            if (pkg) {
                const entryFile = pkg.entryFile;
                pkg.fileAbstractions.forEach(file => {
                    if (requiredFileAbstraction) return;
                    // if no combinations
                    // which means we are dealing with external package require
                    // like require("foo")
                    if (!combinations) {
                        combinations = generateFileCombinations(entryFile);
                    }
                    combinations.some(combination => {
                        let found = file.fuseBoxPath === combination;

                        if (found) {
                            requiredFileAbstraction = file;
                        }
                        return found;
                    });
                });
            }
        });
        return requiredFileAbstraction;
    }
}