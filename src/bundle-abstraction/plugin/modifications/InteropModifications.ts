import { FlatFileGenerator } from "../FlatFileGenerator";
import { OptimisedCore } from "../OptimisedCore";
import { each } from "realm-utils";
import { ExportsInterop } from "../../core/nodes/ExportsInterop";
import { FileAbstraction } from "../../core/FileAbstraction";


export class InteropModifications {
    public static perform(core: OptimisedCore, generator: FlatFileGenerator, file: FileAbstraction): Promise<void> {
        if (core.opts.shouldRemoveExportsInterop()) {
            return each(file.exportsInterop, (interop: ExportsInterop) => {
                return interop.remove();
            });
        }
    }
}