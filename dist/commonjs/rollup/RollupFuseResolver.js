"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const PathMaster_1 = require("../core/PathMaster");
function RollupFuseResolver(context, root) {
    return {
        resolveId(importee, importer) {
            if (!importer) {
                return null;
            }
            let pm = new PathMaster_1.PathMaster(context, root);
            if (importee.indexOf("~") === 0) {
                const localFile = "." + importee.slice(1);
                let resolved = pm.resolve(localFile, root);
                return resolved.absPath;
            }
            let resolved = pm.resolve(importee, root);
            if (resolved.isNodeModule) {
                if (resolved.nodeModuleInfo && resolved.nodeModuleInfo.entry) {
                    return resolved.nodeModuleInfo.entry;
                }
            }
            const basename = path.basename(importer);
            const directory = importer.split(basename)[0];
            const dirIndexFile = path.join(directory + importee, "index.js");
            let stats;
            try {
                stats = fs_1.statSync(dirIndexFile);
            }
            catch (e) {
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
exports.RollupFuseResolver = RollupFuseResolver;
