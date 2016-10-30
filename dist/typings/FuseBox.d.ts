import { FuseBoxDump } from "./Dump";
import { BundleData } from "./Arithmetic";
export declare class FuseBox {
    opts: any;
    homeDir: string;
    dump: FuseBoxDump;
    virtualFiles: any;
    private printLogs;
    private collectionSource;
    private timeStart;
    constructor(opts: any);
    bundle(str: string, standalone?: boolean): Promise<string | void>;
    process(bundleData: BundleData, standalone?: boolean): Promise<string>;
}
