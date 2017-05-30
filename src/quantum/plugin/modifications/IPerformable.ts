import { OptimisedCore } from "../OptimisedCore";
import { FileAbstraction } from "../../core/FileAbstraction";


export interface IPerformable {
    perform(core: OptimisedCore, file: FileAbstraction): Promise<void>
}
