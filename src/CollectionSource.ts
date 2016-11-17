import { WorkFlowContext } from "./WorkflowContext";
import { ModuleWrapper } from "./ModuleWrapper";
import { ModuleCollection } from "./ModuleCollection";
import { File } from "./File";
export class CollectionSource {
    constructor(public context: WorkFlowContext) { }

    public get(collection: ModuleCollection): Promise<string> {
        if (collection.cachedContent) {
            return new Promise((resolve, reject) => {
                return resolve(collection.cachedContent);
            });

        }
        return this.resolveFiles(collection.dependencies).then(cnt => {
            let entryFile = collection.entryFile;
            return ModuleWrapper.wrapModule(
                collection.name,
                collection.conflictingVersions,
                cnt.join("\n"),
                entryFile ? entryFile.info.fuseBoxPath : "");
        });
        /*
        let cnt = [];
        collection.dependencies.forEach(file => {
            let content = ModuleWrapper.wrapGeneric(file.info.fuseBoxPath, file.contents);
            cnt.push(content);
        });
        return new Promise((resolve, reject) => {
            let entryFile = collection.entryFile;
            return resolve(ModuleWrapper.wrapModule(collection.name, collection.conflictingVersions, cnt.join("\n"),
                entryFile ? entryFile.info.fuseBoxPath : ""));
        });*/

    }
    private resolveFiles(files: Map<string, File>) {
        let cnt = [];
        let promises: Promise<any>[] = [];
        files.forEach(file => {
            file.resolving.forEach(p => {
                promises.push(p);
            });
        });
        return Promise.all(promises).then(() => {
            files.forEach(file => {
                let content = ModuleWrapper.wrapGeneric(file.info.fuseBoxPath, file.contents);
                cnt.push(content);
            });
            return cnt;
        })
    }
}