import { VirtualFile } from "./VirtualFile";
export declare class MissingImportsRemoval {
    collection: Map<string, VirtualFile>;
    constructor(collection: Map<string, VirtualFile>);
    ensureAll(): void;
    private findFile(userPath);
}
