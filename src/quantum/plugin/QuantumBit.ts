import { RequireStatement } from "../core/nodes/RequireStatement";
import { FileAbstraction } from "../core/FileAbstraction";
import { hashString, joinFuseBoxPath } from "../../Utils";
import { each } from "realm-utils";
import { PackageAbstraction } from "../core/PackageAbstraction";
import { QuantumCore } from "./QuantumCore";

export class QuantumBit {
    public name: string;
    public core: QuantumCore;
    private candidates: Map<string, FileAbstraction> = new Map();
    private modulesCanidates = new Map<string, PackageAbstraction>();
    private isEntryModule = false;
    public files: Map<string, FileAbstraction> = new Map();

    public modules = new Map<string, PackageAbstraction>();

    constructor(public entry: FileAbstraction, public requireStatement: RequireStatement) {
        this.generateName();
        this.core = this.entry.core;
        this.entry.quantumBitEntry = true;
        this.isEntryModule = !this.entry.belongsToProject();
        this.requireStatement.setValue(this.name);

    }

    public isNodeModules() {
        return this.requireStatement.isNodeModule;
    }

    private generateName() {
        this.name = hashString(this.entry.getFuseBoxFullPath())
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
                })

                dep.dependents.forEach(dependent => {
                    if (origin === false && !dependent.quantumBit) {
                        pkg.quantumBitBanned = true;
                    }
                })


            })
        }
        return true;
    }
    private async populateDependencies(file?: FileAbstraction) {

        const dependencies = file.getDependencies();
        await each(dependencies, async (statements: Set<RequireStatement​​>, dependency: FileAbstraction) => {
            if (dependency.belongsToProject()) {
                if (dependency.quantumBit && dependency.quantumBit !== this) {
                    dependency.quantumBitBanned = true;
                } else {
                    dependency.quantumBit = this;
                    if (!this.candidates.has(dependency.getFuseBoxFullPath())) {
                        this.candidates.set(dependency.getFuseBoxFullPath(), dependency);
                        await this.populateDependencies(dependency);
                    }
                }
            } else {

                this.dealWithModule(dependency);
            }

        });
    }

    public async resolve(file?: FileAbstraction) {

        if (this.isEntryModule) {

            this.dealWithModule(this.entry, true);
        } else {
            this.files.set(this.entry.getFuseBoxFullPath(), this.entry)
        }

        await this.populateDependencies(this.entry);
        await each(this.candidates, async (file: FileAbstraction) => {
            await each(file.dependents, (dependent: FileAbstraction) => {
                if (!dependent.quantumBit) { file.quantumBitBanned = true; };
            });
        });

        this.modulesCanidates.forEach(moduleCandidate => {
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
                }
            });
            if (moduleCandidate.quantumBitBanned) {
                moduleCandidate.fileAbstractions.forEach(f => {
                    f.getDependencies().forEach((key, dep) => {
                        if (dep.belongsToExternalModule()) {
                            const existingCandidate = this.modulesCanidates.get(dep.packageAbstraction.name);
                            if (existingCandidate) { // demote MOFO
                                existingCandidate.quantumBitBanned = true;
                            }
                        }
                    });
                })
            }
        });
    }

    public populate() {

        this.candidates.forEach(candidate => {
            if (!candidate.quantumBitBanned) {
                this.files.set(candidate.getFuseBoxFullPath(), candidate)
            }
        });
        this.modulesCanidates.forEach(moduleCandidate => {
            if (!moduleCandidate.quantumBitBanned) {
                this.modules.set(moduleCandidate.name, moduleCandidate)
            }
        });
    }
}
