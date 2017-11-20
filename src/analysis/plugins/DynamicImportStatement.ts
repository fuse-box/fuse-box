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
                    if (file.context.bundle.producer) {
                        const producer = file.context.bundle.producer;
                        const splitConfig = producer.fuse.context.quantumSplitConfig;
                        if (splitConfig) {
                            const alisedByName = splitConfig.byName(requireStatement);
                            if (alisedByName) {
                                requireStatement = `~/${alisedByName}`;
                            }
                        }
                    }
                    let result = file.context.replaceAliases(requireStatement);
                    requireStatement = result.requireStatement;
                    let resolved = file.collection.pm.resolve(requireStatement, file.info.absDir);
                    if (resolved) {
                        
                        if (resolved.isNodeModule) {    
                            analysis.addDependency(resolved.nodeModuleName);
                        } else {
                            if (resolved.fuseBoxPath && fs.existsSync(resolved.absPath)) {
                                arg1.value = `~/${resolved.fuseBoxPath}`;
                                if( !file.belongsToProject()){
                                    arg1.value = `${file.collection.name}/${resolved.fuseBoxPath}`;
                                }
                                //analysis.add2Replacement(arg1.raw, JSON.stringify(arg1.value));
                                analysis.addDependency(resolved.absPath);
                                file.analysis.requiresRegeneration = true;
                            }
                        }
                    }
                }
            }
        }
    }

    public static onEnd() { }
}
