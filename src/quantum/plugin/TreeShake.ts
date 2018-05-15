import { BundleAbstraction } from "../core/BundleAbstraction";
import { each } from "realm-utils";
import { PackageAbstraction } from "../core/PackageAbstraction";
import { FileAbstraction } from "../core/FileAbstraction";
import { QuantumCore } from "./QuantumCore";
import { RequireStatement } from "../core/nodes/RequireStatement";

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
            let uknownStatements = new Set<RequireStatement>()
            file.namedExports.forEach(fileExport => {
                if( fileExport.name === "default" ) {
                    file.restrictRemoval();
                }
                if (!fileExport.isUsed && file.isTreeShakingAllowed()
                    && fileExport.eligibleForTreeShaking) {
                    const isDangerous = fileExport.name === "__esModule" || fileExport.name === "default";
                    if (!isDangerous) {
                        this.core.log.echoInfo(`tree shaking: Remove ${fileExport.name} from ${file.getFuseBoxFullPath()}`)
                        //file.localExportUsageAmount.get(fileExport.)
                        fileExport.remove();

                        // check for the referenced name
                        // for example
                        // var bar_1 = $fsx.r(2);
                        // exports.bar = bar_1.bar;
                        // when removing "exports.bar" "bar_1" is left out, we need to find in require statements check if it's not used and remove it too
                        // and of course de-refence the file as well
                        if (fileExport.referencedVariableName) {
                            file.requireStatements.forEach(s => {
                                if (s.identifier === fileExport.referencedVariableName) {
                                    s.localReferences--;
                                    uknownStatements.add(s);
                                }
                            });
                        }
                    }
                }
            });
            uknownStatements.forEach(statement => {
                // of nobody is using this require statement
                if (statement.localReferences === 0) {

                    // releasing statement file so it can be removed;
                    let targetFile = statement.resolve();
                    if (targetFile) {
                        targetFile.releaseDependent(file);
                    }

                    //statement.file.releaseDependent(file);
                    statement.removeWithIdentifier();
                }
            });
            if (file.isRemovalAllowed() && file.isNotUsedAnywhere() && this.core.opts.canBeRemovedByTreeShaking(file)) {
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
