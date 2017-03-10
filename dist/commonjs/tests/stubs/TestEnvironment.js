"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const realm_utils_1 = require("realm-utils");
const FuseBox_1 = require("../../core/FuseBox");
const fs = require("fs");
const appRoot = require("app-root-path");
const Utils_1 = require("../../Utils");
const fsExtra = require("fs-extra");
function createEnv(opts) {
    const name = opts.name || `test-${new Date().getTime()}`;
    let tmpFolder = path.join(appRoot.path, ".fusebox", "tests", name);
    fsExtra.ensureDirSync(tmpFolder);
    let localPath = path.join(tmpFolder, name);
    const output = {
        modules: {},
    };
    const modulesFolder = path.join(localPath, "modules");
    return realm_utils_1.each(opts.modules, (moduleParams, name) => {
        return new Promise((resolve, reject) => {
            moduleParams.outFile = path.join(modulesFolder, name, "index.js");
            moduleParams.package = name;
            moduleParams.cache = false;
            moduleParams.log = false;
            moduleParams.tsConfig = path.join(appRoot.path, "test", "fixtures", "tsconfig.json");
            FuseBox_1.FuseBox.init(moduleParams).bundle(moduleParams.instructions, () => {
                if (moduleParams.onDone) {
                    moduleParams.onDone({
                        localPath,
                        filePath: moduleParams.outFile,
                        projectDir: path.join(localPath, "project"),
                    });
                }
                output.modules[name] = require(moduleParams.outFile);
                return resolve();
            });
        });
    }).then(() => {
        const projectOptions = opts.project;
        projectOptions.outFile = path.join(localPath, "project", "index.js");
        projectOptions.cache = false;
        projectOptions.log = false;
        projectOptions.tsConfig = path.join(appRoot.path, "test", "fixtures", "tsconfig.json");
        projectOptions.modulesFolder = modulesFolder;
        return new Promise((resolve, reject) => {
            FuseBox_1.FuseBox.init(projectOptions).bundle(projectOptions.instructions, () => {
                let contents = fs.readFileSync(projectOptions.outFile);
                const length = contents.buffer.byteLength;
                output.project = require(projectOptions.outFile);
                output.projectSize = length;
                output.projectContents = contents;
                return resolve();
            });
        });
    }).then(() => {
        Utils_1.removeFolder(localPath);
        return output;
    });
}
exports.createEnv = createEnv;
