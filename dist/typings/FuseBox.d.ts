import { BundleData } from "./Arithmetic";
import { ModuleCollection } from "./ModuleCollection";
export declare class FuseBox {
    opts: any;
    homeDir: string;
    dump: FuseBoxDump;
    virtualFiles: any;
    constructor(opts: any);
    bundle(str: string, standalone?: boolean): Promise<string | void>;
    process(bundleData: BundleData, standalone?: boolean): Promise<string>;
    getCollectionSource(collection: ModuleCollection, depsOnly?: boolean, entryPoint?: string): Promise<string>;
    collectNodeModules(defaultCollection: ModuleCollection): Promise<Map<string, ModuleCollection>>;
}
export declare class FuseBoxDump {
    modules: {};
    log(moduleName: string, file: string, contents: string): void;
    printLog(): void;
}
