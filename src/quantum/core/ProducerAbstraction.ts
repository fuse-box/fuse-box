import { BundleAbstraction } from "./BundleAbstraction";
import { generateFileCombinations } from "./utils";
import { ProducerWarning } from "./ProducerWarning";
import { QuantumCore } from "../plugin/QuantumCore";
import { FileAbstraction } from "./FileAbstraction";

export interface ProducerAbtractionOptions {
	customComputedStatementPaths?: Set<RegExp>;
	quantumCore?: QuantumCore;
}
export class ProducerAbstraction {
	public warnings = new Set<ProducerWarning>();
	public bundleAbstractions: Map<string, BundleAbstraction>;
	public opts: ProducerAbtractionOptions;
	public useNumbers = true;
	public quantumCore: QuantumCore;
	public useComputedRequireStatements = false;

	constructor(opts?: ProducerAbtractionOptions) {
		this.opts = opts || {};
		this.quantumCore = this.opts.quantumCore;
		this.bundleAbstractions = new Map<string, BundleAbstraction>();
		this.opts.customComputedStatementPaths = this.opts.customComputedStatementPaths || new Set();
	}

	public registerBundleAbstraction(bundleAbstraction: BundleAbstraction) {
		bundleAbstraction.producerAbstraction = this;
		this.bundleAbstractions.set(bundleAbstraction.name, bundleAbstraction);
	}

	public addWarning(msg: string) {
		this.warnings.add(new ProducerWarning(msg));
	}

	public findFileAbstraction(packageName: string, resolvedPathRaw: string): FileAbstraction | undefined {
		let combinations: string[] = generateFileCombinations(resolvedPathRaw);

		for (const [, bundle] of this.bundleAbstractions) {
			if (!bundle.packageAbstractions.has(packageName)) {
				continue;
			}
			const pkg = bundle.packageAbstractions.get(packageName);
			const entryFile = pkg.entryFile;
			// if no combinations
			// means we are dealing with external package require
			// or requiring a package.json dir relatively
			// like require("foo") or require('../../') from "foo/a/b"
			if (!combinations) {
				combinations = generateFileCombinations(entryFile);
			}

			for (const combination of combinations) {
				for (const [, file] of pkg.fileAbstractions) {
					const found = file.fuseBoxPath === combination;
					//console.log(found, combination);
					if (found) {
						return file;
					}
				}
			}
		}
	}
}
