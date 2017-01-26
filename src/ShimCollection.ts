import { IPackageInformation, IPathInformation } from './PathMaster';
import { WorkFlowContext } from './WorkflowContext';
import { File } from './File';
import { ModuleCollection } from './ModuleCollection';

/**
 * 
 * 
 * @export
 * @class ShimCollection
 */
export class ShimCollection {
    /**
     * 
     * 
     * @static
     * @param {WorkFlowContext} context
     * @param {string} name
     * @param {string} exports
     * 
     * @memberOf ShimCollection
     */
    public static create(context: WorkFlowContext, name: string, exports: string): ModuleCollection {
        // faking entry
        let entryInfo = <IPathInformation>{
            isNodeModule: false,
            fuseBoxPath: "index.js"
        };
        let entryFile = new File(context, entryInfo);
        entryFile.isLoaded = true;
        entryFile.analysis.skip();
        entryFile.contents = `module.exports = ${exports}`;

        let collection = new ModuleCollection(context, name, <IPackageInformation>{
            missing: false,
        });
        collection.dependencies.set(name, entryFile);
        collection.setupEntry(entryFile);
        return collection;
    }
}