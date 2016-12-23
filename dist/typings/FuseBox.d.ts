import { BundleData } from "./Arithmetic";
import { ModuleCollection } from "./ModuleCollection";
export declare class FuseBox {
    opts: any;
    static init(opts?: any): FuseBox;
    virtualFiles: any;
    private collectionSource;
    private context;
    constructor(opts: any);
    triggerPre(): void;
    triggerStart(): void;
    triggerEnd(): void;
    triggerPost(): void;
    bundle(str: string, daemon?: boolean): Promise<any>;
    process(bundleData: BundleData, standalone?: boolean): Promise<ModuleCollection>;
    private initiateBundle(str);
}
