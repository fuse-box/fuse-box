import { WorkFlowContext } from "./WorkflowContext";
import { FuseBoxDump } from "./Dump";
import { ModuleWrapper } from "./ModuleWrapper";
import { ModuleCollection } from "./ModuleCollection";
import { Module } from "./Module";
import { each } from "realm-utils";
export class CollectionSource {
    constructor(public context: WorkFlowContext) {

    }
    public get(collection: ModuleCollection, depsOnly?: boolean) {
        if (collection.cachedContent) {
            return new Promise((resolve, reject) => {
                this.context.dump.log(collection.name, "[cached]", collection.cachedContent);
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

                let rpath = module.getProjectPath(entry, projectPath || entry.dir);

                if (!visited[rpath]) {
                    visited[rpath] = true;
                    if (module.isLoaded) {
                        let content = ModuleWrapper.wrapGeneric(rpath, module.contents);
                        cnt.push(content);
                        this.context.dump.log(collection.name, rpath, content);
                    }

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

        return collectionResources(entry).then(() => {
            return ModuleWrapper.wrapModule(collection.name, cnt.join("\n"), entry.isLoaded
                ? entry.getProjectPath() : undefined);
        });
    }
}