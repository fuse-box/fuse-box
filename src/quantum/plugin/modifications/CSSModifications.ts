import { each } from "realm-utils";
import { FileAbstraction } from "../../core/FileAbstraction";
import { QuantumCore } from "../QuantumCore";
import { RequireStatement } from "../../core/nodes/RequireStatement";
import { CSSFile } from '../../core/CSSFile';

export class CSSModifications {
    public static async perform(core: QuantumCore, file: FileAbstraction): Promise<void> {
        if (!core.opts.shouldGenerateCSS()) {
            return;
        }
        const forRemoval: RequireStatement[] = [];
        await each(file.requireStatements, (statement: RequireStatement) => {
            if (statement.nodeModuleName === "fuse-box-css") {
                if (statement.ast.$parent && statement.ast.$parent.arguments) {
                    const args = statement.ast.$parent.arguments;
                    if (args.length !== 2) {
                        return;
                    }
                    const cssPath = args[0].value;
                    const cssRaw = args[1].value;
                    const cssFile = new CSSFile(cssPath, cssRaw);
                    core.cssCollection.add(cssFile);
                    core.postTasks.add(() => {
                        this.removeStatement(statement);
                    });
                    forRemoval.push(statement);
                }
            }
        });
        forRemoval.forEach(statement => {
            file.requireStatements.delete(statement);
        })
    }

    private static removeStatement(statement: RequireStatement) {
        const info = statement.removeCallExpression();
        const target = statement.file;
        if (info.success) {
            if ( info.empty){
                target.markForRemoval();
            }
            return;
        }
        target.dependents.forEach(dependent => {
            dependent.requireStatements.forEach(depStatement => {
                const targetStatement = depStatement.resolve();
                const matched = targetStatement === target;
                if (matched) { depStatement.remove(); }
            })
        })

    }
}