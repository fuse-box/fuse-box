import { RequireStatement } from "../core/nodes/RequireStatement";
import { FileAbstraction } from "../core/FileAbstraction";
import { hashString } from "../../Utils";
import { each } from "realm-utils";
import { PackageAbstraction } from "../core/PackageAbstraction";

export class QuantumBit {
    public name: string;
    private candidates: Map<string, FileAbstraction> = new Map();
    private modulesCanidates = new Map<string, PackageAbstraction>();
    public files: Map<string, FileAbstraction> = new Map();
    public modules = new Map<string, PackageAbstraction>();

    constructor(public entry: FileAbstraction, public requireStatement: RequireStatement) {
        this.generateName();
        this.requireStatement.setValue(this.name);
    }

    public isNodeModules() {
        return this.requireStatement.isNodeModule;
    }
    private generateName() {
        this.name = hashString(this.entry.getFuseBoxFullPath())
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
                // that's a node_module we need to move packages too (if possible)
                // For this purpose we need to register all entry entry points
                // and assign QuantumBit instance
                let pkg = dependency.packageAbstraction;
                if (pkg.quantumBit && pkg.quantumBit !== this) {
                    pkg.quantumBitBanned = true;
                } else {
                    pkg.quantumBit = this;
                    if (!this.modulesCanidates.has(pkg.name)) {
                        this.modulesCanidates.set(pkg.name, pkg);
                    }
                    if(!pkg.entries.has(dependency.getFuseBoxFullPath())){
                        dependency.quantumBit = this;
                        pkg.entries.set(dependency.getFuseBoxFullPath(), dependency);
                    }
                }
            }

        });
    }

    public async resolve(file?: FileAbstraction) {
        await this.populateDependencies(this.entry);
        await each(this.candidates, async (file: FileAbstraction) => {
            await each(file.dependents, (dependent: FileAbstraction) => {
                if (!dependent.quantumBit) { file.quantumBitBanned = true; };
            });
        });

        this.modulesCanidates.forEach(moduleCandidate => {
            
            moduleCandidate.entries.forEach(entry => {
                entry.dependents.forEach(dependent => {
                    if (!dependent.quantumBit) { 
                        moduleCandidate.quantumBitBanned = true; 
                    };
                })
            });
        });
    }

    public populate() {
        this.files.set(this.entry.getFuseBoxFullPath(), this.entry);
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
