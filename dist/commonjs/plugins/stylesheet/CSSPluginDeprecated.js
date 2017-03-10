"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const realm_utils_1 = require("realm-utils");
const Utils_1 = require("../../Utils");
const path = require("path");
class CSSPluginDeprecated {
    static writeOptions(opts, file) {
        if (!realm_utils_1.utils.isPlainObject(opts)) {
            opts = {};
        }
        if (file.context.outFile) {
            let base = path.dirname(file.context.outFile);
            let projectPath = Utils_1.replaceExt(file.info.fuseBoxPath, ".css");
            let newPath = Utils_1.ensureUserPath(path.join(base, projectPath));
            let initialContents = file.contents;
            file.contents = `__fsbx_css("${projectPath}")`;
            let tasks = [];
            if (file.sourceMap) {
                let sourceMapFile = projectPath + ".map";
                initialContents += `\n/*# sourceMappingURL=${sourceMapFile} */`;
                let souceMapPath = Utils_1.ensureUserPath(path.join(base, sourceMapFile));
                let initialSourceMap = file.sourceMap;
                file.sourceMap = undefined;
                tasks.push(new Promise((resolve, reject) => {
                    fs.writeFile(souceMapPath, initialSourceMap, (err, res) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    });
                }));
            }
            tasks.push(new Promise((resolve, reject) => {
                fs.writeFile(newPath, initialContents, (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                });
            }));
            return Promise.all(tasks);
        }
    }
}
exports.CSSPluginDeprecated = CSSPluginDeprecated;
