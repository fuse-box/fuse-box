import { BundleData } from "./Arithmetic";
import { ModuleCollection } from "./ModuleCollection";
export declare class FuseBox {
    opts: any;
    virtualFiles: any;
    private collectionSource;
    private context;
    constructor(opts: any);
    triggerStart(): void;
    triggerEnd(): void;
    bundle(str: string, standalone?: boolean): Promise<any>;
    process(bundleData: BundleData, standalone?: boolean): Promise<ModuleCollection>;
}
