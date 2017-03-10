export declare class ImportDeclaration {
    item: any;
    node: any;
    parent: any;
    name: string;
    isDefault: boolean;
    localReference: string;
    constructor(item: any, node: any, parent: any);
    remove(): void;
}
/**
 *
 *
 * @export
 * @interface VirtualFile
 */
export declare class VirtualFile {
    contents: any;
    exports: string[];
    ast: any;
    defaultExports: boolean;
    localImports: Map<string, Map<string, ImportDeclaration>>;
    constructor(contents: any);
    inExports(name: string): boolean;
    generate(): any;
    /**
     * Extract imports
     * @param node
     * @param parent
     */
    private registerImportDeclaration(node, parent);
}
