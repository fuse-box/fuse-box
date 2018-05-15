import { each } from "realm-utils";
import { FileAbstraction } from "../../core/FileAbstraction";
import { QuantumCore } from "../QuantumCore";
import { ReplaceableBlock } from "../../core/nodes/ReplaceableBlock";

export class ProcessEnvModification {
    public static perform(core: QuantumCore, file: FileAbstraction): Promise<void> {

        if (core.opts.shouldReplaceProcessEnv()) {
            return each(file.processNodeEnv, (env: ReplaceableBlock) => {
                // working with conditional
                // removing dead code here
                if (env.isConditional) {
                    env.handleActiveCode();
                } else {
                    env.replaceWithValue();
                }
            });
        }
    }
}