import { OptimisedCore } from "../OptimisedCore";
import { FlatFileGenerator } from "../FlatFileGenerator";
import { FileAbstraction } from "../../core/FileAbstraction";


export interface IPerformable {
    perform(core: OptimisedCore, generator: FlatFileGenerator, file: FileAbstraction): Promise<void>
}
