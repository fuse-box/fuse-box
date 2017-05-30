import { OptimisedCore } from "../OptimisedCore";
import { each } from "realm-utils";
import { FileAbstraction } from "../../core/FileAbstraction";
import { GenericAst } from "../../core/nodes/GenericAst";


export class ProcessEnvModification {
    public static perform(core: OptimisedCore, file: FileAbstraction): Promise<void> {

        if (core.opts.shouldReplaceProcessEnv()) {
            return each(file.processNodeEnv, (env: GenericAst) => {
                env.replaceWithString("production")
            })
        }
    }
}