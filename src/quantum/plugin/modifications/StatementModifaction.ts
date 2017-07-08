import { each } from "realm-utils";
import { RequireStatement } from "../../core/nodes/RequireStatement";
import { FileAbstraction } from "../../core/FileAbstraction";
import { QuantumCore } from "../QuantumCore";


export class StatementModification {
    public static perform(core: QuantumCore, file: FileAbstraction): Promise<void> {
        return each(file.requireStatements, (statement: RequireStatement) => {
            if (statement.isComputed) {
                let customSolution = core.getCustomSolution(file);

                if (customSolution && !core.api.hashesUsed()) {
                    if (customSolution.rules) {
                        customSolution.rules.fn(statement, core);
                    }
                    statement.setFunctionName("$fsx.p");
                } else {
                    statement.setFunctionName("$fsx.r");
                    //statement.setFunctionName("$fsx.c");
                    //statement.bindID(file.getID());
                    // file map is requested with computed require statements
                    //file.addFileMap();
                }
            } else {
                let resolvedFile = statement.resolve();
                if (resolvedFile) {
                    resolvedFile.amountOfReferences++;
                    // trying to setup hoisting here
                    if (statement.identifier) {
                        file.registerHoistedIdentifiers(statement.identifier, statement, resolvedFile);
                    }

                    statement.setFunctionName('$fsx.r');
                    statement.setValue(resolvedFile.getID());
                } else {
                    if (core.opts.isTargetServer() || core.opts.isTargetUniveral()) {
                        core.api.useServerRequire();
                        statement.setFunctionName('$fsx.s');
                    } else {
                        statement.setFunctionName('$fsx.r');
                    }

                }
            }
        });
    }
}