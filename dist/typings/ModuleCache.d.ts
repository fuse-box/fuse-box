export declare class ModuleCache {
    cacheFolder: string;
    private cacheFile;
    private cachedDeps;
    constructor();
    getValidCachedDependencies(name: string): any;
    storeLocalDependencies(projectModules: any): void;
    set(name: string, contents: string): Promise<{}>;
}
export declare let cache: ModuleCache;
