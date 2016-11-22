import { WorkFlowContext } from "./WorkflowContext";
import { ModuleCollection } from "./ModuleCollection";
import { File } from "./File";
export class CollectionSource {
    constructor(public context: WorkFlowContext) { }

    public get(collection: ModuleCollection, withSourceMaps: boolean = false): Promise<string> {
        if (collection.cachedContent) {
            return new Promise((resolve, reject) => {
                this.context.source.addContent(collection.cachedContent);
                return resolve(collection.cachedContent);
            });
        }
        this.context.source.startCollection(collection);
        return this.resolveFiles(collection.dependencies).then(cnt => {
            return this.context.source.endCollection(collection);
        });

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
                this.context.source.addFile(file);
            });
            return cnt;
        })
    }
}