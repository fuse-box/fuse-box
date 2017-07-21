import { BundleAbstraction } from "./BundleAbstraction";
import { generateFileCombinations } from "./utils";
import { ProducerWarning } from "./ProducerWarning";
import { QuantumCore } from "../plugin/QuantumCore";

export interface ProducerAbtractionOptions {
    customComputedStatementPaths?: Set<RegExp>;
    quantumCore?: QuantumCore;
}
export class ProducerAbstraction {
    public warnings = new Set<ProducerWarning>();
    public bundleAbstractions = new Map<string, BundleAbstraction>();
    public opts: ProducerAbtractionOptions;
    public useNumbers = true;
    public quantumCore: QuantumCore;
    public useComputedRequireStatements = false;

    constructor(opts?: ProducerAbtractionOptions) {
        this.opts = opts || {};
        this.quantumCore = this.opts.quantumCore;

        this.opts.customComputedStatementPaths = this.opts.customComputedStatementPaths || new Set();
    }

    public registerBundleAbstraction(bundleAbstraction: BundleAbstraction) {
        bundleAbstraction.producerAbstraction = this;
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
                // if no combinations
                // which means we are dealing with external package require
                // like require("foo")
                if (!combinations) {
                    combinations = generateFileCombinations(entryFile);
                }

                combinations.some(combination => {
                    let found;
                    pkg.fileAbstractions.forEach(file => {
                        if (requiredFileAbstraction) { return; };
                        found = file.fuseBoxPath === combination;
                        //console.log(found, combination);
                        if (found) {
                            requiredFileAbstraction = file;
                        }
                    });
                    return found;
                });

            }
        });
        return requiredFileAbstraction;
    }
}
