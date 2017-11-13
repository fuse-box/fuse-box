import { each } from "realm-utils";
import { FileAbstraction } from "../../core/FileAbstraction";
import { QuantumCore } from "../QuantumCore";
import { RequireStatement } from "../../core/nodes/RequireStatement";
import { QuantumBit } from "../QuantumBit";

export class DynamicImportStatementsModifications {
    public static perform(core: QuantumCore, file: FileAbstraction): Promise<void> {
        return each(file.dynamicImportStatements, (statement: RequireStatement) => {
            let target = statement.resolve();
            

            // if we can resolve a dynamic statements
            // that means that it could be technically mapped to a split bundle
            // or just resolved as it is
            if (target) {
                //console.log(target);
                target.canBeRemoved = false;
                

                const bit = new QuantumBit(target, statement);
                target.quantumBit = bit;
                core.quantumBits.set(bit.name, bit);
                if (!target.dependents.has(file)) {
                    target.dependents.add(file);
                }
                core.api.addLazyLoading();
                core.api.useCodeSplitting();
            } else {
                
                core.api.considerStatement(statement);
            }
            
            statement.setFunctionName(`${core.opts.quantumVariableName}.l`);
        });
    }
}