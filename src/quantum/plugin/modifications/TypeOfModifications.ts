import { each } from "realm-utils";
import { FileAbstraction } from "../../core/FileAbstraction";
import { GenericAst } from "../../core/nodes/GenericAst";
import { QuantumCore } from "../QuantumCore";

export class TypeOfModifications {
    public static perform(core: QuantumCore, file: FileAbstraction): Promise<void> {
        if (!core.opts.shouldReplaceTypeOf()) {
            return;
        }
        return each(file.typeofExportsKeywords, (keyword: GenericAst) => {
            keyword.replaceWithString("object");
        }).then(() => {
            return each(file.typeofModulesKeywords, (keyword: GenericAst) => {
                keyword.replaceWithString("object");
            });
        }).then(() => {
            return each(file.typeofGlobalKeywords, (keyword: GenericAst) => {
                if (core.opts.isTargetBrowser()) {
                    keyword.replaceWithString("undefined");
                }
                if (core.opts.isTargetServer()) {
                    keyword.replaceWithString("object");
                }
            });
        }).then(() => {
            return each(file.typeofWindowKeywords, (keyword: GenericAst) => {
                if (core.opts.isTargetBrowser()) {
                    keyword.replaceWithString("object");
                }
                if (core.opts.isTargetServer()) {
                    keyword.replaceWithString("undefined");
                }
            });
        }).then(() => {
            return each(file.typeofDefineKeywords, (keyword: GenericAst) => {
                keyword.replaceWithString("undefined");
            });
        }).then(() => {
            return each(file.typeofRequireKeywords, (keyword: GenericAst) => {
                keyword.replaceWithString("function");
            });
        })
    }
}