"use strict";
const ArithmeticStringParser_1 = require("./ArithmeticStringParser");
const Config_1 = require("./Config");
const realm_utils_1 = require("realm-utils");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const glob = require("glob");
const deleteFolderRecursive = (p) => {
    if (fs.existsSync(p)) {
        fs.readdirSync(p).forEach((file, index) => {
            let curPath = path.join(p, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(p);
    }
};
class BundleData {
    constructor(homeDir, including, excluding, entry) {
        this.homeDir = homeDir;
        this.including = including;
        this.excluding = excluding;
        this.entry = entry;
    }
    setupTempFolder(tmpFolder) {
        this.tmpFolder = tmpFolder;
    }
    fileBlackListed(file) {
        return this.excluding.has(file.getCrossPlatormPath());
    }
    fileWhiteListed(file) {
        return this.including.has(file.getCrossPlatormPath());
    }
    finalize() {
        if (this.tmpFolder) {
            deleteFolderRecursive(this.tmpFolder);
        }
    }
    shouldIgnore(name) {
        return this.excluding.has(name);
    }
    shouldIgnoreDependencies(name) {
        if (this.including.has(name)) {
            return this.including.get(name).deps === false;
        }
    }
    shouldIgnoreNodeModules(asbPath) {
        if (this.including.has(asbPath)) {
            return this.including.get(asbPath).deps === false;
        }
        return false;
    }
}
exports.BundleData = BundleData;
class Arithmetic {
    static parse(str) {
        let parser = new ArithmeticStringParser_1.PropParser(str);
        parser.parse();
        return parser;
    }
    static getFiles(parser, virtualFiles, homeDir) {
        let collect = (list) => {
            let data = new Map();
            return realm_utils_1.each(list, (withDeps, filePattern) => {
                if (filePattern.match(/^[a-z0-9_-]+$/i)) {
                    data.set(filePattern, {
                        deps: withDeps,
                        nodeModule: true,
                    });
                    return;
                }
                let fp = path.join(homeDir, filePattern);
                if (!filePattern.match(/\.js$/)) {
                    fp += ".js";
                }
                return new Promise((resolve, reject) => {
                    glob(fp, (err, files) => {
                        for (let i = 0; i < files.length; i++) {
                            data.set(files[i], {
                                deps: withDeps
                            });
                        }
                        return resolve();
                    });
                });
            }).then(x => {
                return data;
            });
        };
        return realm_utils_1.chain(class extends realm_utils_1.Chainable {
            prepareVirtualFiles() {
                if (virtualFiles) {
                    this.tempFolder = path.join(Config_1.Config.TEMP_FOLDER, new Date().getTime().toString());
                    homeDir = this.tempFolder;
                    mkdirp.sync(this.tempFolder);
                    return realm_utils_1.each(virtualFiles, (fileContents, fileName) => {
                        let filePath = path.join(this.tempFolder, fileName);
                        let fileDir = path.dirname(filePath);
                        mkdirp.sync(fileDir);
                        fs.writeFileSync(filePath, fileContents);
                    });
                }
            }
            setTempFolder() {
                return this.tempFolder;
            }
            setIncluding() {
                return collect(parser.including);
            }
            setExcluding() {
                return collect(parser.excluding);
            }
            setEntry() {
                let keys = Object.keys(parser.entry);
                if (keys.length) {
                    return keys[0];
                }
            }
        }
        ).then(result => {
            let data = new BundleData(homeDir, result.including, result.excluding, result.entry);
            if (result.tempFolder) {
                data.setupTempFolder(result.tempFolder);
            }
            return data;
        });
    }
}
exports.Arithmetic = Arithmetic;
