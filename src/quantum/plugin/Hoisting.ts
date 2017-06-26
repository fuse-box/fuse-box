import { QuantumCore } from "./QuantumCore";
import { each } from "realm-utils";
import { BundleAbstraction } from "../core/BundleAbstraction";
import { RequireStatement } from "../core/nodes/RequireStatement";
import { FileAbstraction } from "../core/FileAbstraction";

export class Hoisting {
    constructor(public core: QuantumCore) { }

    public start() {
        this.core.log.echoInfo(`Launch hoisting`);

        const bundleAbstractions = this.core.producerAbstraction.bundleAbstractions;
        return each(bundleAbstractions, (bundleAbstraction: BundleAbstraction​​) => {
            const hoistedCollection = new Map<string, Set<RequireStatement>>();
            const actuallyHoisted = new Map<string, FileAbstraction>();
            bundleAbstraction.identifiers.forEach((collection, identifier) => {
                if (this.core.opts.isHoistingAllowed(identifier)) {
                    const statements = new Map<any, Set<RequireStatement>>();
                    let firstId;
                    let firstFile;
                    collection.forEach(item => {
                        const fileID = firstId = item.file.getID();
                        firstFile = item.file;
                        let list: Set<RequireStatement>;
                        if (!statements.get(fileID)) {
                            list = new Set<RequireStatement>();
                            statements.set(fileID, list);
                        } else {
                            list = statements.get(fileID);
                        }
                        list.add(item.statement);
                    });
                    // hoist if the amount is 1 (for now)
                    // which means that a variable "React" is unique and is being referenced to the same file id
                    if (statements.size === 1) {
                        const requireStatements = statements.get(firstId);
                        // we do it only if the same statement is repeated 
                        if (requireStatements.size > 1) {
                            this.core.log.echoInfo(`Hoisting: ${identifier} will be hoisted in bundle "${bundleAbstraction.name}"`);
                            actuallyHoisted.set(identifier, firstFile);
                            hoistedCollection.set(identifier, statements.get(firstId));
                        }
                    }
                }
            });
            bundleAbstraction.hoisted = actuallyHoisted;
            hoistedCollection.forEach((hoisted, key) => {
                hoisted.forEach(requireStatement =>
                    requireStatement.removeWithIdentifier());
            });
        });
    }
}