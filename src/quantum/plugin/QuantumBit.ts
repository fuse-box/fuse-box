import { hashString, joinFuseBoxPath } from "../../Utils";
import { CSSCollection } from "../core/CSSCollection";
import { FileAbstraction } from "../core/FileAbstraction";
import { RequireStatement } from "../core/nodes/RequireStatement";
import { PackageAbstraction } from "../core/PackageAbstraction";
import { QuantumCore } from "./QuantumCore";

export class QuantumBit {
	public name: string;
	public core: QuantumCore;
	public banned = false;
	public cssCollection: CSSCollection;
	private candidates: Map<string, FileAbstraction>;
	private modulesCanidates: Map<string, PackageAbstraction>;
	private isEntryModule = false;

	private modules2proccess: FileAbstraction[];
	public files: Map<string, FileAbstraction>;

	public modules: Map<string, PackageAbstraction>;

	constructor(public entry: FileAbstraction, public requireStatement: RequireStatement) {
		this.generateName();
		this.modulesCanidates = new Map<string, PackageAbstraction>();
		this.candidates = new Map();
		this.modules = new Map();
		this.files = new Map();
		this.modules2proccess = [];

		this.core = this.entry.core;
		this.entry.quantumBitEntry = true;
		this.isEntryModule = !this.entry.belongsToProject();
		this.requireStatement.setValue(this.name);
	}

	public isNodeModules() {
		return this.requireStatement.isNodeModule;
	}

	private generateName() {
		this.name = hashString(this.entry.getFuseBoxFullPath());
	}

	public getBundleName() {
		const dest = this.core.context.quantumSplitConfig.getDest();
		return joinFuseBoxPath(dest, this.name);
	}

	public isEligible() {
		return this.files.size > 0 || this.modules.size > 0;
	}

	private dealWithModule(file: FileAbstraction, origin = false) {
		// that's a node_module we need to move packages too (if possible)
		// For this purpose we need to register all entry entry points
		// and assign QuantumBit instance
		let pkg = file.packageAbstraction;
		if (!origin && file.quantumBitEntry) {
			return;
		}

		if (!this.modulesCanidates.has(pkg.name)) {
			this.modulesCanidates.set(pkg.name, pkg);
			pkg.fileAbstractions.forEach(dep => {
				if (dep.quantumBit) {
					if (dep.quantumBit !== this) {
						pkg.quantumBitBanned = true;
					}
				} else {
					dep.quantumBit = this;
				}

				dep.getDependencies().forEach((key, libDep) => {
					if (libDep.belongsToExternalModule()) {
						if (!libDep.quantumBitEntry) {
							this.dealWithModule(libDep);
						}
					}
				});
				if (origin === false) {
					dep.dependents.forEach(dependent => {
						if (!dependent.quantumBit && dependent.packageAbstraction !== dep.packageAbstraction) {
							pkg.quantumBitBanned = true;
						}
					});
				}
			});
		}
		return true;
	}

	private populateDependencies(file?: FileAbstraction) {
		const dependencies = file.getDependencies();
		for (const item of dependencies) {
			const dependency = item[0];
			if (dependency.belongsToProject()) {
				if (dependency.quantumBit && dependency.quantumBit !== this) {
					dependency.referencedRequireStatements.forEach(ref => {
						if (!ref.isDynamicImport) {
							dependency.quantumBitBanned = true;
						}
					});
				} else {
					dependency.quantumBit = this;
					if (!this.candidates.has(dependency.getFuseBoxFullPath())) {
						this.candidates.set(dependency.getFuseBoxFullPath(), dependency);
						this.populateDependencies(dependency);
					}
				}
			} else {
				this.modules2proccess.push(dependency);
			}
		}
	}

	private findRootDependents(f: FileAbstraction, list: FileAbstraction[]): FileAbstraction[] {
		if (list.indexOf(f) === -1) {
			list.push(f);
			if (f !== this.entry) {
				f.dependents.forEach(dep => {
					this.findRootDependents(dep, list);
				});
			}
		}
		return list;
	}

	public resolve(file?: FileAbstraction) {
		if (this.isEntryModule) {
			this.dealWithModule(this.entry, true);
		} else {
			this.files.set(this.entry.getFuseBoxFullPath(), this.entry);
		}

		this.populateDependencies(this.entry);
		this.modules2proccess.forEach(dep => this.dealWithModule(dep));

		for (const p of this.candidates) {
			const file = p[1];
			const rootDependents = this.findRootDependents(file, []);
			for (const root of rootDependents) {
				if (!root.quantumBit && root !== this.entry) {
					file.quantumBitBanned = true;
				} else {
					if (root.quantumBit && root.quantumBit !== this && root !== this.entry) {
						file.quantumBitBanned = true;
					}
				}
			}
			if (!file.quantumBit) {
				file.quantumBitBanned = true;
			}
		}

		for (const item of this.modulesCanidates) {
			const moduleCandidate = item[1];
			// a case where the same library is imported dynamically and through require statements
			// we need to ban it and all of it dependencies
			moduleCandidate.fileAbstractions.forEach(file => {
				let dynamicStatementUsed = false;
				let regularStatementUsed = false;
				file.referencedRequireStatements.forEach(ref => {
					if (ref.isDynamicImport) {
						dynamicStatementUsed = true;
					} else {
						regularStatementUsed = true;
					}
				});
				if (dynamicStatementUsed && regularStatementUsed) {
					moduleCandidate.quantumBitBanned = true;
					if (this.entry === file) {
						// if QuantumBit entry matches the file in a package
						// e.g import('foobar') whereas foobar and its files (with the entry) are listed
						// in moduleCandidates (which contains only one package
						// in this case) the whole QuantumBit should be banned. Otherwise it will result
						// in creating empty files
						this.banned = true;
					}
				}
			});
			if (moduleCandidate.quantumBitBanned) {
				moduleCandidate.fileAbstractions.forEach(f => {
					f.getDependencies().forEach((key, dep) => {
						if (dep.belongsToExternalModule()) {
							const existingCandidate = this.modulesCanidates.get(dep.packageAbstraction.name);
							if (existingCandidate) {
								// demote MOFO
								existingCandidate.quantumBitBanned = true;
							}
						}
					});
				});
			}
		}

		this.modulesCanidates.forEach(pkg => {
			if (!pkg.quantumBitBanned) {
				pkg.fileAbstractions.forEach(f => {
					const dependents = this.findRootDependents(f, []);
					dependents.forEach(dep => {
						if (!dep.quantumBit && dep !== this.entry) {
							pkg.quantumBitBanned = true;
						} else {
							if (dep.quantumBit && dep.quantumBit !== this && dep !== this.entry) {
								pkg.quantumBitBanned = true;
							}
						}
					});
				});
			}
		});
	}

	public populate() {
		this.candidates.forEach(candidate => {
			if (!candidate.quantumBitBanned) {
				this.files.set(candidate.getFuseBoxFullPath(), candidate);
			}
		});
		this.modulesCanidates.forEach(moduleCandidate => {
			if (!moduleCandidate.quantumBitBanned) {
				this.modules.set(moduleCandidate.name, moduleCandidate);
			}
		});
	}
}
