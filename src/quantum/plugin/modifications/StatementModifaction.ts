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
                    if (core.opts.isTargetServer() || core.opts.isTargetUniveral()) {
                        core.api.useServerRequire();
                        statement.setFunctionName('$fsx.s');
                    } else {
                        statement.setFunctionName('$fsx.r');
                    }
                }
            } else {
                let resolvedFile = statement.resolve();
                if (resolvedFile) {
                    if (resolvedFile.isProcessPolyfill() && !core.opts.shouldBundleProcessPolyfill()) {
                        return statement.removeWithIdentifier();
                    }
                    if (!resolvedFile.dependents.has(file)) {
                        resolvedFile.dependents.add(file);
                    }
                    resolvedFile.amountOfReferences++;
                    // trying to setup hoisting here
                    if (statement.identifier) {
                        file.registerHoistedIdentifiers(statement.identifier, statement, resolvedFile);
                    }

                    statement.setFunctionName('$fsx.r');
                    statement.setValue(resolvedFile.getID());
                } else {

                    // Unresolved modules are handled differently here.
                    // with target npm we preserve original require statements
                    // in order for other bundlers to pick it up
                    if (core.opts.isTargetNpm()) {
                        statement.setFunctionName('require');
                    } else if (core.opts.isTargetServer() || core.opts.isTargetUniveral()) {
                        // server or universal targets will detect the environment
                        core.api.useServerRequire();
                        statement.setFunctionName('$fsx.s');
                    } else {
                        // if it's a browser, we use async
                        statement.setFunctionName('$fsx.r');
                    }

                }
            }
        });
    }
}