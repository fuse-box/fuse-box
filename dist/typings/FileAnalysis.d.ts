import { File } from "./File";
export declare class FileAnalysis {
    file: File;
    ast: any;
    private wasAnalysed;
    private skipAnalysis;
    dependencies: string[];
    constructor(file: File);
    astIsLoaded(): boolean;
    loadAst(ast: any): void;
    skip(): void;
    parseUsingAcorn(): void;
    analyze(): void;
    private removeFuseBoxApiFromBundle();
}
