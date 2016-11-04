import { ModuleCollection } from "./ModuleCollection";
import { each } from "realm-utils";

export interface INodeModulesCollection {
    projectModules: string[];
    collections: Map<string, ModuleCollection>;
}

export let moduleCollector = (defaultCollection: ModuleCollection): Promise<INodeModulesCollection> => {
    let modules: Map<string, ModuleCollection> = new Map();

    let rootModules = {};
    /**
     *
     *
     * @param {Map<string, ModuleCollection>} nodeModules
     * @returns
     */
    let collect = (nodeModules: Map<string, ModuleCollection>, root) => {
        return each(nodeModules, (collection, name) => {
            let currentRoot = {};
            root[name] = { deps: currentRoot };
            if (!modules.has(name)) {
                modules.set(name, collection);

                if (collection.nodeModules.size > 0) {
                    return new Promise((resolve, reject) => {
                        process.nextTick(() => {
                            return resolve(collect(collection.nodeModules, currentRoot));
                        });
                    });
                }
            }
        });
    };
    return collect(defaultCollection.nodeModules, rootModules).then(x => {
        return <INodeModulesCollection>{
            projectModules: rootModules,
            collections: modules,
        };
    });
}