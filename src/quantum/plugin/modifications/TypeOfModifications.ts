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
            if (!file.definedLocally.has("exports")) {
                keyword.replaceWithString("object");
            }
        }).then(() => {
            return each(file.typeofModulesKeywords, (keyword: GenericAst) => {
                if (!file.definedLocally.has("module")) {
                    keyword.replaceWithString("object");
                }
            });
        }).then(() => {
            return each(file.typeofGlobalKeywords, (keyword: GenericAst) => {
                if (core.opts.isTargetBrowser()) {
                    if (!file.definedLocally.has("global")) {
                        keyword.replaceWithString("undefined");
                    }
                }
                if (core.opts.isTargetServer()) {
                    if (!file.definedLocally.has("global")) {
                        keyword.replaceWithString("object");
                    }
                }
            });
        }).then(() => {
            return each(file.typeofWindowKeywords, (keyword: GenericAst) => {
                if (core.opts.isTargetBrowser()) {
                    if (!file.definedLocally.has("window")) {
                        keyword.replaceWithString("object");
                    }
                }
                if (core.opts.isTargetServer()) {
                    if (!file.definedLocally.has("window")) {
                        keyword.replaceWithString("undefined");
                    }

                }
            });
        }).then(() => {
            return each(file.typeofDefineKeywords, (keyword: GenericAst) => {
                keyword.replaceWithString("undefined");
            });
        }).then(() => {
            return each(file.typeofRequireKeywords, (keyword: GenericAst) => {
                if (!file.definedLocally.has("require")) {
                    keyword.replaceWithString("function");
                }
            });
        })
    }
}