import { each } from "realm-utils";
import { FileAbstraction } from "../../core/FileAbstraction";
import { QuantumCore } from "../QuantumCore";
import { RequireStatement } from "../../core/nodes/RequireStatement";

export class DynamicImportStatementsModifications {
    public static perform(core: QuantumCore, file: FileAbstraction): Promise<void> {
        return each(file.dynamicImportStatements, (statement: RequireStatement) => {
            core.api.considerStatement(statement);
            statement.setFunctionName('$fsx.l');
        });
    }
}