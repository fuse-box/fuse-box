import { each } from "realm-utils";
import { FileAbstraction } from "../../core/FileAbstraction";
import { QuantumCore } from "../QuantumCore";
import { RequireStatement } from "../../core/nodes/RequireStatement";

export class DynamicImportStatementsModifications {
    public static perform(core: QuantumCore, file: FileAbstraction): Promise<void> {
        return each(file.dynamicImportStatements, (statement: RequireStatement) => {
            let target = statement.resolve();

            // if we can resolve a dynamic statements
            // that means that it could be technically mapped to a split bundle
            // or just resolved as it is
            if (target) {
                // first type checking the code splitting config here
                const splitConfig = core.context.quantumSplitConfig;
                if (splitConfig) {
                    const config = splitConfig.findByEntry(target);
                    if (config) {
                        // finally replacing the value with the actual bundle name 
                        statement.setValue(config.name);
                        core.api.considerStatement(statement);
                    }
                }
            } else {
                core.api.considerStatement(statement);
            }
            
            statement.setFunctionName(`${core.opts.quantumVariableName}.l`);
        });
    }
}