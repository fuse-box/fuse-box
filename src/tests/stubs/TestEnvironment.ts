import * as path from "path";
import { each } from "realm-utils";
import { FuseBox } from "../../core/FuseBox";
import * as fs from "fs";
import * as appRoot from "app-root-path";
import { removeFolder } from "../../Utils";
import * as fsExtra from "fs-extra";
const jsdom = require("jsdom");

export function getStubsFolder() {
    return path.join(appRoot.path, "src/tests/stubs");
}
export function createEnv(opts: any) {
    const name = opts.name || `test-${new Date().getTime()}`;

    let tmpFolder = path.join(appRoot.path, ".fusebox", "tests", name);
    const serverOnly = opts.server === true;

    fsExtra.ensureDirSync(tmpFolder);
    let localPath = path.join(tmpFolder, name);

    const output: any = {
        modules: {},
    };
    const scripts = [];



    const modulesFolder = path.join(localPath, "modules");
    // creating modules
    return each(opts.modules, (moduleParams, name) => {
        return new Promise((resolve, reject) => {
            moduleParams.output = path.join(modulesFolder, name, "index.js");
            moduleParams.package = name;
            moduleParams.cache = false;
            moduleParams.log = false;

            moduleParams.tsConfig = path.join(appRoot.path, "test", "fixtures", "tsconfig.json");
            const fuse = FuseBox.init(moduleParams);
            fuse.bundle("index.js").cache(false).instructions(moduleParams.instructions);
            return fuse.run().then(bundle => {
                if (moduleParams.onDone) {
                    moduleParams.onDone({
                        localPath,
                        filePath: moduleParams.output,
                        projectDir: path.join(localPath, "project"),
                    });
                }

                if (serverOnly) {
                    output.modules[name] = require(moduleParams.output);
                } else {
                    scripts.push(moduleParams.output);
                }

                return resolve();
            }).catch(reject);
        });
    }).then(() => {
        const projectOptions = opts.project;
        projectOptions.output = path.join(localPath, "project", "index.js");
        projectOptions.cache = false;
        projectOptions.log = false;
        projectOptions.tsConfig = path.join(appRoot.path, "test", "fixtures", "tsconfig.json");
        projectOptions.modulesFolder = modulesFolder;

        const fuse = FuseBox.init(projectOptions);


        fuse.bundle("index.js").cache(false).instructions(projectOptions.instructions)
        return fuse.run().then(bundle => {
            let contents = fs.readFileSync(projectOptions.output);
            const length = contents.buffer.byteLength;
            output.projectContents = contents;
            output.projectSize = length;
            if (serverOnly) {
                output.project = require(projectOptions.output);
            } else {
                scripts.push(projectOptions.output);
                return new Promise((resolve, reject) => {
                    jsdom.env({
                        html: "<html><head></head><body></body></html>",
                        scripts: scripts,
                        done: function (err, window) {

                            if (err) {
                                return reject(err);
                            }


                            output.project = window;
                            output.projectSize = length;
                            output.querySelector = window.document.querySelector
                            output.querySelectorAll = window.document.querySelectorAll;
                            output.projectContents = contents;
                            return resolve(output);
                        }
                    });
                });
            }



        });
    }).then(() => {
        setTimeout(() => {
            removeFolder(localPath);
        }, 5);
        return output;
    });
}
