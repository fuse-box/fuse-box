import { OptimisedCore } from "../OptimisedCore";
import { each } from "realm-utils";
import { FileAbstraction } from "../../core/FileAbstraction";
import { GenericAst } from "../../core/nodes/GenericAst";


export class TypeOfModifications {
    public static perform(core: OptimisedCore, file: FileAbstraction): Promise<void> {
        return each(file.typeofExportsKeywords, (keyword: GenericAst) => {
            keyword.replaceWithString("object");
        }).then(() => {
            return each(file.typeofModulesKeywords, (keyword: GenericAst) => {
                keyword.replaceWithString("object");
            });
        })
    }
}