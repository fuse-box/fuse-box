import { each } from "realm-utils";
import { FileAbstraction } from "../../core/FileAbstraction";
import { GenericAst } from "../../core/nodes/GenericAst";
import { QuantumCore } from "../QuantumCore";

export class ProcessEnvModification {
    public static perform(core: QuantumCore, file: FileAbstraction): Promise<void> {

        if (core.opts.shouldReplaceProcessEnv()) {
            return each(file.processNodeEnv, (env: GenericAst) => {
                env.replaceWithString("production");
            });
        }
    }
}