import { BundleAbstraction } from "./BundleAbstraction";
import { generateFileCombinations } from "./utils";
import { ProducerWarning } from "./ProducerWarning";
export interface ProducerAbtractionOptions {
    customComputedStatementPaths?: Set<RegExp>
}
export class ProducerAbstraction {
    public warnings = new Set<ProducerWarning>();
    public bundleAbstractions = new Map<string, BundleAbstraction>();
    public opts: ProducerAbtractionOptions;
    public useNumbers = true;
    public useComputedRequireStatements = false;
    constructor(opts?: ProducerAbtractionOptions) {
        this.opts = opts || {};

        this.opts.customComputedStatementPaths = this.opts.customComputedStatementPaths || new Set();
    }
    public registerBundleAbstraction(bundleAbstraction: BundleAbstraction) {
        this.bundleAbstractions.set(bundleAbstraction.name, bundleAbstraction);
    }

    public addWarning(msg: string) {
        this.warnings.add(new ProducerWarning(msg));
    }



    public findFileAbstraction(packageName: string, resolvedPathRaw: string) {
        let combinations: string[] = generateFileCombinations(resolvedPathRaw);

        let requiredFileAbstraction;
        this.bundleAbstractions.forEach(bundle => {
            if (requiredFileAbstraction) { return; };

            const pkg = bundle.packageAbstractions.get(packageName);
            if (pkg) {
                const entryFile = pkg.entryFile;
                pkg.fileAbstractions.forEach(file => {
                    if (requiredFileAbstraction) { return; };
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