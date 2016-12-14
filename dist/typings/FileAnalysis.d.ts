import { File } from "./File";
export declare class FileAnalysis {
    file: File;
    ast: any;
    dependencies: string[];
    constructor(file: File);
    process(): void;
    private parse();
    private analyze();
}
