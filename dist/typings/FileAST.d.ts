import { File } from "./File";
export declare class FileAST {
    file: File;
    ast: any;
    dependencies: string[];
    constructor(file: File);
    consume(): void;
    private parse();
    private processDependencies();
    private extractStreamVariables();
    private processNodejsVariables();
}
