import { each } from "realm-utils";
import { ExportsInterop } from "../../core/nodes/ExportsInterop";
import { FileAbstraction } from "../../core/FileAbstraction";
import { QuantumCore } from "../QuantumCore";


export class InteropModifications {
    public static perform(core: QuantumCore, file: FileAbstraction): Promise<void> {
        if (core.opts.shouldRemoveExportsInterop()) {
            return each(file.exportsInterop, (interop: ExportsInterop) => {
                return interop.remove();
            });
        }
    }
}