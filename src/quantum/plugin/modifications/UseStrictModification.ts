import { each } from "realm-utils";
import { UseStrict } from "../../core/nodes/UseStrict";
import { FileAbstraction } from "../../core/FileAbstraction";
import { QuantumCore } from "../QuantumCore";

export class UseStrictModification {
    public static perform(core: QuantumCore, file: FileAbstraction): Promise<void> {
        if (core.opts.shouldRemoveUseStrict()) {
            return each(file.useStrict, (useStrict: UseStrict) => {
                return useStrict.remove();
            });
        }
    }
}