import { statSync } from "fs";
import * as path from "path";
import { PathMaster, IPathInformation } from "../core/PathMaster";
import { WorkFlowContext } from "../core/WorkflowContext";

export function RollupFuseResolver(context: WorkFlowContext, root: string) {
    return {

        resolveId(importee, importer) {

            if (!importer) {
                return null;
            }
            let pm = new PathMaster(context, root);

            if (importee.indexOf("~") === 0) {
                const localFile = "." + importee.slice(1);
                let resolved: IPathInformation = pm.resolve(localFile, root);
                return resolved.absPath;
            }

            let resolved: IPathInformation = pm.resolve(importee, root);
            if (resolved.isNodeModule) {
                if (resolved.nodeModuleInfo && resolved.nodeModuleInfo.entry) {
                    return resolved.nodeModuleInfo.entry;
                }
            }

            const basename = path.basename(importer);
            const directory = importer.split(basename)[0];
            const dirIndexFile = path.join(directory + importee, "index.js");

            // TODO: This should be asynchronous
            let stats;

            try {
                stats = statSync(dirIndexFile);
            } catch (e) {
                return null;
            }

            if (stats.isFile()) {
                console.log("YES", dirIndexFile);
                return dirIndexFile;
            }

            return null;
        },
    };
}
