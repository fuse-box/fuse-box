export declare class ModuleWrapper {
    static wrapFinal(contents: string, entryPoint: string, standalone: boolean): string;
    static wrapModule(name: string, content: string, entry?: string): string;
    static wrapGeneric(name: string, content: string): string;
}
