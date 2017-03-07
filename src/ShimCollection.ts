import { IPackageInformation, IPathInformation } from "./core/PathMaster";
import { ModuleCollection } from "./core/ModuleCollection";
import { WorkFlowContext } from "./core/WorkflowContext";
import { File } from "./core/File";

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
            fuseBoxPath: "index.js",
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
