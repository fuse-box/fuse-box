import { WorkFlowContext } from "./core/WorkflowContext";
import { ModuleCollection } from "./core/ModuleCollection";
import { File } from "./core/File";

export class CollectionSource {
	constructor(public context: WorkFlowContext) {}

	public async get(collection: ModuleCollection): Promise<string> {
		const cacheCollectionSouceMaps =
			collection.name !== this.context.defaultPackageName && this.context.useCache && this.context.sourceMapsVendor;

		const sourceMapCacheKey = `${collection.name}.map`;

		if (collection.cachedContent) {
			let sourceMap;
			if (this.context.cache && cacheCollectionSouceMaps) {
				sourceMap = this.context.cache.getPermanentCache(sourceMapCacheKey);
			}
			this.context.source.addContent(collection.cachedContent, sourceMap);
			return collection.cachedContent;
		}
		this.context.source.createCollection(collection);
		let files = this.filterFiles(collection.dependencies);

		this.context.source.startCollection(collection);
		files.forEach(f => {
			this.context.source.addFile(f);
		});

		const currentCollection = this.context.source.collectionSource;
		// Source maps caching for vendors
		if (cacheCollectionSouceMaps) {
			this.context.cache.setPermanentCache(sourceMapCacheKey, currentCollection.sourceMap);
		}

		return this.context.source.endCollection(collection);
	}

	private filterFiles(files: Map<string, File>): File[] {
		let filtered: File[] = [];
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
