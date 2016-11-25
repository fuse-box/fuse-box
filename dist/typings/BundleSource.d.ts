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
    startCollection(collection: ModuleCollection): void;
    endCollection(collection: ModuleCollection): any;
    addContent(data: string): void;
    addFile(file: File): void;
    finalize(bundleData: BundleData): void;
    getResult(): any;
}
