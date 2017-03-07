import { WorkFlowContext } from "./core/WorkflowContext";
import { ModuleCollection } from "./core/ModuleCollection";
import { File } from "./core/File";

export class CollectionSource {
    constructor(public context: WorkFlowContext) { }

    public get(collection: ModuleCollection): Promise<string> {
        if (collection.cachedContent) {
            return new Promise((resolve, reject) => {
                this.context.source.addContent(collection.cachedContent);
                return resolve(collection.cachedContent);
            });
        }
        this.context.source.createCollection(collection);
        let files = this.filterFiles(collection.dependencies);

        this.context.source.startCollection(collection);
        files.forEach(f => {
            this.context.source.addFile(f);
        });

        return Promise.resolve(this.context.source.endCollection(collection));
    }

    private filterFiles(files: Map<string, File>): File[] {
        let filtered : File[] = [];
        files.forEach(file => {
            if (file.isFuseBoxBundle) {
                this.context.source.addContentToCurrentCollection(file.contents);
            }
            if (!file.info.isRemoteFile) {
                filtered.push(file);
            }

        });
        return filtered;
    }
}
