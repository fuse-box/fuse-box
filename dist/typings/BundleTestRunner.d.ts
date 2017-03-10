import { FuseAPI } from "./lib/FuseApi";
export declare class BundleTestRunner {
    bundle: any;
    fuse: FuseAPI;
    reporter: string;
    opts: any;
    constructor(bundle: any, opts?: any);
    start(): void;
}
