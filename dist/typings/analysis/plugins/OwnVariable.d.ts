import { File } from "../../core/File";
/**
 * If we have an uglified bundle we will still have $fuse$ variable
 * that will help us wrapping
 */
export declare class OwnVariable {
    static onNode(file: File, node: any, parent: any): void;
    static onEnd(): void;
}
