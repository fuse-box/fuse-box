import { ModuleCollection } from './ModuleCollection';
export interface INodeModulesCollection {
    projectModules: string[];
    collections: Map<string, ModuleCollection>;
}
export declare let moduleCollector: (defaultCollection: ModuleCollection) => Promise<INodeModulesCollection>;
