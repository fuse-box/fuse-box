import { BundleData } from './Arithmetic';
import { ModuleCollection } from "./ModuleCollection";
import { WorkFlowContext } from "./WorkFlowContext";
import { File } from "./File";
export declare class BundleSource {
    context: WorkFlowContext;
    standalone: boolean;
    private concat;
    private collectionSource;
    constructor(context: WorkFlowContext);
    init(): void;
    createCollection(collection: ModuleCollection): void;
    addContentToCurrentCollection(data: string): void;
    startCollection(collection: ModuleCollection): void;
    endCollection(collection: ModuleCollection): any;
    addContent(data: string): void;
    addFile(file: File): void;
    finalize(bundleData: BundleData): void;
    getResult(): any;
}
