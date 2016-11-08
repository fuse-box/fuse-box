import { File } from './File';
import { PathMaster } from './PathMaster';


import { WorkFlowContext } from "./WorkFlowContext";
import { Module } from "./Module";
import { each } from "realm-utils";
import { BundleData } from "./Arithmetic";

const appRoot = require("app-root-path");


class CacheCollection {
    public static get(context: WorkFlowContext, cache: any): ModuleCollection {
        let root = new ModuleCollection(context, cache.name);
        //root.setCachedContent(cache.cache);
        let collectDeps = (rootCollection: ModuleCollection, item: any) => {
            for (let depName in item.deps) {
                if (item.deps.hasOwnProperty(depName)) {
                    let nestedCache = item.deps[depName];
                    let nestedCollection = new ModuleCollection(context, nestedCache.name);
                    //nestedCollection.setCachedContent(nestedCache.cache);
                    rootCollection.nodeModules.set(nestedCache.name, nestedCollection);
                    collectDeps(nestedCollection, nestedCache);
                }
            }
        }
        collectDeps(root, cache);
        return root;
    }
}

export class ModuleCollection {
    public nodeModules: Map<string, ModuleCollection> = new Map();
    public dependencies: Map<string, File> = new Map();
    public bundle: BundleData;
    public entryResolved = false;
    public pm: PathMaster;
    public entryFile: File;
    public conflictingVersions: Map<string, string> = new Map();

    constructor(public context: WorkFlowContext, public name: string, public entry?: Module) {
    }



    public setupEntry(file: File) {
        if (this.dependencies.has(file.info.absPath)) {
            this.dependencies.set(file.info.absPath, file);
        }
        file.isNodeModuleEntry = true;
        this.entryFile = file;
    }

    public resolveEntry() {
        if (this.entryFile && !this.entryResolved) {
            this.entryResolved = true;

            return this.resolve(this.entryFile);
        }
    }




    /**
     *
     *
     * @param {BundleData} data
     * @returns {Promise<Module>}
     *
     * @memberOf ModuleCollection
     */
    public collectBundle(data: BundleData): Promise<Module> {
        this.bundle = data;
        // faking entry point
        return each(data.including, (withDeps, modulePath) => {

            let file = new File(this.context, this.pm.init(modulePath));
            return this.resolve(file);
        }).then(x => {

            return module;
        });
    }

    public resolve(file: File) {

        if (file.info.isNodeModule) {
            let info = file.info.nodeModuleInfo;
            let collection: ModuleCollection;
            let moduleName = info.custom ?
                `${info.name}@${info.version}` : info.name;

            if (!this.context.hasNodeModule(moduleName)) {
                collection = new ModuleCollection(this.context, moduleName);

                collection.pm = new PathMaster(this.context, info.root);
                if (info.entry) {
                    collection.setupEntry(new File(this.context, collection.pm.init(info.entry)));
                }
                this.context.spinStart(`Resolve ${moduleName}`);
                this.context.addNodeModule(moduleName, collection);
            } else {
                collection = this.context.getNodeModule(moduleName);
            }
            if (info.custom) {
                this.conflictingVersions.set(info.name, info.version);
            }
            this.nodeModules.set(moduleName, collection);

            return file.info.nodeModuleExplicitOriginal
                ? collection.resolve(new File(this.context, collection.pm.init(file.info.absPath)))
                : collection.resolveEntry();

        } else {

            if (this.dependencies.has(file.absPath)) { return; }

            let dependencies = file.consume();
            this.dependencies.set(file.absPath, file);
            let fileLimitPath;

            // Checking for the limits
            // we must have a workaround for ../ and if it goes beyond project limits
            if (this.entryFile && this.entryFile.isNodeModuleEntry) {
                fileLimitPath = this.entryFile.info.absPath;
            }

            return each(dependencies, name =>
                this.resolve(new File(this.context,
                    this.pm.resolve(name, file.info.absDir, fileLimitPath)))
            );

        }
    }


    /*
    public addPath2Module(parent: Module, modulePath: string) {
        let shouldIgnoreDeps = false;
        if (this.bundle) {
            if (this.bundle.excluding.has(parent.absPath)) {
                return;
            }
            shouldIgnoreDeps = this.bundle.shouldIgnoreNodeModules(parent.absPath);
        }
        let target = new Module(this.context, modulePath);
        let dir = path.dirname(modulePath);
        return this.resolve(target, dir);
    }*/




    // public resolve(module: Module) {
    //     let shouldIgnoreDeps = false;
    //     if (this.bundle) {
    //         if (this.bundle.excluding.has(module.absPath)) {
    //             return;
    //         }
    //         shouldIgnoreDeps = this.bundle.shouldIgnoreNodeModules(module.absPath);
    //     }
    //     let requires = module.digest();
    //     return each(requires, options => {
    //         if (this.pm) {
    //             console.log("root",this.root, options.name);
    //             let res = this.pm.resolve(options.name, this.root);
    //             console.log(res);
    //         }
    //         return this.processModule(module, options.name, shouldIgnoreDeps);
    //     });
    // }


    // public addRootFile(info: INodeModuleRequire) {

    //     let modulePath = path.join(this.packageInfo.root, info.target);

    //     let module = new Module(this.context, modulePath);
    //     let fileRootDirectory = path.join(this.packageInfo.root, path.dirname(info.target));
    //     module.setDir(fileRootDirectory);
    //     module.setPackage(this.packageInfo);

    //     this.entry.addDependency(module);
    //     return this.resolve(module);
    // }

    // public addProjectFile(module: Module, name: string) {

    //     let modulePath; // module.getAbsolutePathOfModule(name, this.packageInfo);
    //     if (path.isAbsolute(name)) {
    //         modulePath = name;
    //     } else {

    //         let relativePath = ensureRelativePath(name, module.absPath);

    //         modulePath = path.join(path.dirname(module.absPath), relativePath);


    //     }

    //     if (this.bundle) {
    //         if (this.bundle.shouldIgnore(modulePath)) { // make sure we ignore if bundle is set
    //             return;
    //         }
    //     }
    //     if (MODULE_CACHE[modulePath]) {
    //         module.addDependency(MODULE_CACHE[modulePath]);
    //     } else {
    //         let dependency = new Module(this.context, modulePath);

    //         dependency.setDir(path.dirname(modulePath));
    //         dependency.setPackage(this.packageInfo);
    //         MODULE_CACHE[modulePath] = dependency;
    //         module.addDependency(dependency);
    //         return this.resolve(dependency);
    //     }
    // }

    // public processModule(module: Module, name: string, shouldIgnoreDeps?: boolean) {

    //     let moduleInfo = getNodeModuleName(name);
    //     if (moduleInfo) {

    //         let nodeModule = moduleInfo.name;

    //         if (shouldIgnoreDeps) {
    //             return;
    //         }
    //         if (this.bundle) { // is a bundle defined we need to check for configuration
    //             if (this.bundle.shouldIgnore(nodeModule)) {
    //                 return;
    //             }
    //         }

    //         if (!this.context.hasNodeModule(nodeModule)) {
    //             // if (this.context.useCache) {
    //             //     let cachedDeps = cache.getValidCachedDependencies(nodeModule);
    //             //     if (cachedDeps) {
    //             //         let cached = CacheCollection.get(this.context, cachedDeps);
    //             //         this.nodeModules.set(nodeModule, cached);
    //             //         return;
    //             //     }
    //             // }
    //             let packageInfo = getPackageInformation(nodeModule, this.packageInfo);

    //             let targetEntry = new Module(this.context, packageInfo.entry);

    //             let collection = new ModuleCollection(this.context, nodeModule, targetEntry);
    //             collection.setPackageInfo(packageInfo);
    //             this.context.addNodeModule(nodeModule, collection);
    //             this.nodeModules.set(nodeModule, collection);
    //             // If it's a partial request
    //             if (moduleInfo.target) {
    //                 return collection.addRootFile(moduleInfo);
    //             } else {

    //                 return collection.collect();
    //             }
    //         } else {
    //             let collection = this.context.getNodeModule(nodeModule);
    //             this.nodeModules.set(nodeModule, collection);
    //             if (moduleInfo.target) {
    //                 return collection.addRootFile(moduleInfo);
    //             } else {

    //                 if (!collection.entryResolved) {

    //                     return collection.collect();
    //                 }
    //             }
    //         }

    //     } else {

    //         return this.addProjectFile(module, name);
    //     }
    // }

}
