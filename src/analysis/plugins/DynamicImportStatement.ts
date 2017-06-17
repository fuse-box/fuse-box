import { File } from "../../core/File";
import * as fs from "fs";
/**
 * 
 * Fixing import() and bundle split for development purposes
 * 
 * @export
 * @class DynamicImportStatement
 */
export class DynamicImportStatement {

    public static onNode(file: File, node: any, parent: any) {
        const analysis = file.analysis;
        if (node.type === "CallExpression" && node.callee) {
            if (node.callee.type === "Identifier" && node.callee.name === "$fsmp$") {
                let arg1 = node.arguments[0];
                if (analysis.nodeIsString(arg1)) {
                    let requireStatement = arg1.value;
                    let resolved = file.collection.pm.resolve(requireStatement, file.info.absDir);
                    if (resolved && resolved.fuseBoxPath && fs.existsSync(resolved.absPath)) {
                        arg1.value = `~/${resolved.fuseBoxPath}`;
                        file.analysis.requiresRegeneration = true;
                    }
                }
            }
        }
    }

    public static onEnd() { }
}
