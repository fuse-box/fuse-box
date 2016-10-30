import { FuseBoxDump } from "./Dump";
import { ModuleWrapper } from "./ModuleWrapper";
import { ModuleCollection } from "./ModuleCollection";
import { Module } from "./Module";
import { each } from "realm-utils";
export class CollectionSource {
    constructor(public dump: FuseBoxDump) {

    }
    public get(collection: ModuleCollection, depsOnly?: boolean) {
        if (collection.cachedContent) {
            return new Promise((resolve, reject) => {
                this.dump.log(collection.name, "[cached]", collection.cachedContent);
                return resolve(collection.cachedContent);
            });
        }
        let entry: Module = collection.entry;

        if (!entry) {
            return new Promise((resolve, reject) => {
                return resolve(ModuleWrapper.wrapModule(collection.name, "", collection.name));
            });
        }
        let visited: any = {};
        let cnt = [];
        /**
         *
         *
         * @param {Module} module
         * @param {string} [projectPath]
         * @returns
         */
        let collectionResources = (module: Module, projectPath?: string) => {

            return new Promise((resolve, reject) => {
                if (!module) {
                    return resolve();
                }
                let rpath = module.getProjectPath(entry, entry.dir);

                if (!visited[rpath]) {
                    visited[rpath] = true;
                    let content = ModuleWrapper.wrapGeneric(rpath, module.contents);
                    this.dump.log(collection.name, rpath, content);
                    cnt.push(content);
                    return each(module.dependencies, dep => {
                        return collectionResources(dep);
                    }).then(resolve).catch(reject);
                }
                return resolve();
            });
        };

        if (depsOnly) { // bundle might not have an entry point. Instead we just process dependencies
            return each(entry.dependencies, dep => {
                return collectionResources(dep, entry.dir);
            }).then(result => {
                return ModuleWrapper.wrapModule(collection.name, cnt.join("\n"));
            });
        }

        return collectionResources(entry).then(result => {
            return ModuleWrapper.wrapModule(collection.name, cnt.join("\n"), entry.getProjectPath());
        });
    }
}