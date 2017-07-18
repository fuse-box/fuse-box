import { BundleAbstraction } from "../core/BundleAbstraction";
import { each } from "realm-utils";
import { PackageAbstraction } from "../core/PackageAbstraction";
import { FileAbstraction } from "../core/FileAbstraction";
import { QuantumCore } from "./QuantumCore";

export class TreeShake {
    constructor(public core: QuantumCore) { }

    /**
     * Initiate tree shaking
     */
    public shake(): Promise<any> {
        return this.eachFile(file => this.shakeExports(file))
            .then(() => this.releaseReferences())
            .then(() => this.removeUnusedExports());
    }


    private releaseReferences() {
        return this.eachFile(file => {
            if (file.isNotUsedAnywhere() && this.core.opts.canBeRemovedByTreeShaking(file)) {
                return this.eachFile(target => target.releaseDependent(file));
            }
        });
    }
    /**
     * Remove exports if allowed and expose dead code to uglifyjs
     */
    private removeUnusedExports() {
        return this.eachFile(file => {
            file.namedExports.forEach(fileExport => {
                if (!fileExport.isUsed && file.isTreeShakingAllowed()
                    && fileExport.eligibleForTreeShaking) {
                    const isDangerous = fileExport.name === "__esModule" || fileExport.name === "default";
                    if (!isDangerous) {
                        this.core.log.echoInfo(`tree shaking: Remove ${fileExport.name} from ${file.getFuseBoxFullPath()}`)
                        //file.localExportUsageAmount.get(fileExport.)
                        fileExport.remove();
                    }
                }
            });
            if (file.isNotUsedAnywhere() && this.core.opts.canBeRemovedByTreeShaking(file)) {
                this.core.log.echoInfo(`tree shaking: Mark for removal ${file.getFuseBoxFullPath()}`)
                file.markForRemoval();
            }
        });
    }

    /**
     * Figure out if we can actually tree shake a file
     * @param target
     */
    private shakeExports(target: FileAbstraction) {
        return this.eachFile(file => {
            const dependencies = file.getDependencies();
            // check if our target is referenced in that file
            // e.g require('./foo') - considering that foo is resolved target
            if (dependencies.has(target)) {
                const dependency = dependencies.get(target);
                dependency.forEach(statement => {
                    if (statement.usedNames.size > 0) {
                        target.shakable = true;
                    } else {
                        target.restrictTreeShaking();
                    }
                    target.namedExports.forEach(fileExport => {
                        // now we check if file exports matches a name
                        const nameIsUsed = statement.usedNames.has(fileExport.name);
                        // if an exports is used, mark
                        // mark it
                        if (nameIsUsed) {
                            fileExport.isUsed = true;
                        } else {
                            if (target.localExportUsageAmount.get(fileExport.name)
                                && target.localExportUsageAmount.get(fileExport.name) > 1) {
                                fileExport.isUsed = true;
                            }
                        }
                    });
                });
            }
        });
    }

    private eachFile(fn: { (file: FileAbstraction) }) {
        return each(this.core.producerAbstraction.bundleAbstractions, (bundleAbstraction: BundleAbstraction​​) => {
            return each(bundleAbstraction.packageAbstractions, (packageAbstraction: PackageAbstraction) => {
                return each(packageAbstraction.fileAbstractions, (fileAbstraction: FileAbstraction) => {
                    return fn(fileAbstraction);
                });
            })
        });
    }
}
