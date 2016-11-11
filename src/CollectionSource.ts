import { WorkFlowContext } from "./WorkflowContext";
import { ModuleWrapper } from "./ModuleWrapper";
import { ModuleCollection } from "./ModuleCollection";

export class CollectionSource {
    constructor(public context: WorkFlowContext) { }

    public get(collection: ModuleCollection): Promise<string> {
        if (collection.cachedContent) {
            return new Promise((resolve, reject) => {
                return resolve(collection.cachedContent);
            });

        }
        let cnt = [];
        collection.dependencies.forEach(file => {
            this.context.dump.log(collection.name, file.info.fuseBoxPath, file.contents);
            let content = ModuleWrapper.wrapGeneric(file.info.fuseBoxPath, file.contents);
            cnt.push(content);
        });
        return new Promise((resolve, reject) => {
            let entryFile = collection.entryFile;
            return resolve(ModuleWrapper.wrapModule(collection.name, collection.conflictingVersions, cnt.join("\n"),
                entryFile ? entryFile.info.fuseBoxPath : ""));
        });
    }
}