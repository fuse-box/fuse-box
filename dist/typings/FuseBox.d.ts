import { BundleData } from "./Arithmetic";
export declare class FuseBox {
    opts: any;
    virtualFiles: any;
    private collectionSource;
    private timeStart;
    private context;
    constructor(opts: any);
    bundle(str: string, standalone?: boolean): Promise<string | void>;
    process(bundleData: BundleData, standalone?: boolean): Promise<string>;
}
