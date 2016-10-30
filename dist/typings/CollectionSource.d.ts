import { FuseBoxDump } from "./Dump";
import { ModuleCollection } from "./ModuleCollection";
export declare class CollectionSource {
    dump: FuseBoxDump;
    constructor(dump: FuseBoxDump);
    get(collection: ModuleCollection, depsOnly?: boolean): any;
}
