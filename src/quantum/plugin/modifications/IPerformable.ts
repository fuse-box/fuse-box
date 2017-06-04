import { FileAbstraction } from "../../core/FileAbstraction";
import { QuantumCore } from "../QuantumCore";


export interface IPerformable {
    perform(core: QuantumCore, file: FileAbstraction): Promise<void>
}
