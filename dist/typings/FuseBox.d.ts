import { BundleData } from "./Arithmetic";
export declare class FuseBox {
    opts: any;
    virtualFiles: any;
    private collectionSource;
    private context;
    constructor(opts: any);
    bundle(str: string, standalone?: boolean): Promise<any>;
    process(bundleData: BundleData, standalone?: boolean): Promise<any>;
}
