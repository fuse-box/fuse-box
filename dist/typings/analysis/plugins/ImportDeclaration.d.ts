import { File } from "../../core/File";
/**
 * Handles require and ImportDeclarations
 * At the moment does not transpile
 */
export declare class ImportDeclaration {
    /**
     * Extract require statements
     * At the same time replace aliases
     */
    static onNode(file: File, node: any, parent: any): void;
    static onEnd(): void;
    /**
     * Replace aliases using the context collection
     */
    private static handleAliasReplacement(file, requireStatement);
}
