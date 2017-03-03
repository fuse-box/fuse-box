import * as fs from "fs";
import { File } from "../../core/File";
import { utils } from "realm-utils";
import { ensureUserPath, replaceExt } from '../../Utils';
import * as path from 'path';

/**
 * This one will be replace with a different function by CSSBundle
 * Will put a deprecation warning soon
 */
export class CSSPluginDeprecated {
    public static writeOptions(opts: any, file: File) {
        if (!utils.isPlainObject(opts)) {
            opts = {};
        }
        // can't work without outFile
        if (file.context.outFile) {
            // Get a directory of our bundle
            let base = path.dirname(file.context.outFile);
            // Change project path extension to .css
            let projectPath = replaceExt(file.info.fuseBoxPath, ".css");

            // Get new path based on where outFile is located + real project path
            // Making sure here that folders are created
            let newPath = ensureUserPath(path.join(base, projectPath));

            let initialContents = file.contents;
            file.contents = `__fsbx_css("${projectPath}")`;

            let tasks = [];
            if (file.sourceMap) {
                let sourceMapFile = projectPath + ".map";
                // adding sourcemap link to a file
                // Sometimes it's already there (written by SASS for example)
                // What shall we do then...
                initialContents += `\n/*# sourceMappingURL=${sourceMapFile} */`;

                let souceMapPath = ensureUserPath(path.join(base, sourceMapFile));
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

            // writing a file
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