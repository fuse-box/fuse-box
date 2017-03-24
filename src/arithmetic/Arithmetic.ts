import { PropParser } from "./ArithmeticStringParser";
import Fluent from "./Fluent";
import { Config } from "./../Config";
import { each, chain, Chainable, utils } from "realm-utils";
import { File } from "../core/File";
import * as path from "path";
import * as fs from "fs";
import * as fsExtra from "fs-extra";
import * as glob from "glob";

const deleteFolderRecursive = (p) => {
    if (fs.existsSync(p)) {
        fs.readdirSync(p).forEach((file, index) => {
            let curPath = path.join(p, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(p);
    }
};

export { Fluent };

export interface IBundleInformation {
    deps: boolean;
    nodeModule?: boolean;
}
/**
 * BundleData
 */
export class BundleData {
    public tmpFolder: string;
    public including: Map<string, IBundleInformation>;
    public excluding: Map<string, IBundleInformation>;
    public depsOnly: Map<string, IBundleInformation>;
    public entry: string;
    public homeDir: string;
    public typescriptMode: boolean;
    public standalone: boolean;
    public cache: boolean;
    public setIncluding(info: Map<string, IBundleInformation>) {

    }


    public setupTempFolder(tmpFolder: string) {
        this.tmpFolder = tmpFolder;
    }

    public fileBlackListed(file: File) {
        return this.excluding.has(file.getCrossPlatormPath());
    }
    public fileWhiteListed(file: File) {
        return this.including.has(file.getCrossPlatormPath());
    }

    public finalize() {
        if (this.tmpFolder) {
            deleteFolderRecursive(this.tmpFolder);
        }
    }

    public shouldIgnore(name: string) {
        return this.excluding.has(name);
    }

    public shouldIgnoreDependencies(name: string) {
        if (this.including.has(name)) {
            return this.including.get(name).deps === false;
        }
    }

    public shouldIgnoreNodeModules(asbPath: string) {
        if (this.including.has(asbPath)) {
            return this.including.get(asbPath).deps === false;
        }
        return false;
    }
}

export interface ArithmeticProperties {
    tempDir: string;
    data: any;
}
/**
 *
 *
 * @export
 * @class Arithmetic
 */
export class Arithmetic {

    /**
     *
     *
     * @static
     * @param {string} str
     * @returns
     *
     * @memberOf Arithmetic
     */
    public static parse(str: string): PropParser {
        let parser = new PropParser(str);
        parser.parse();
        return parser;
    }



    /**
     * Get files from a directory
     * In case of virtualFiles we create a temp folder,
     * where we write all the contents and start from there
     *
     * @static
     * @param {PropParser} parser
     * @param {string} fileCollection
     * @param {string} homeDir
     * @returns
     *
     * @memberOf Arithmetic
     */
    public static getFiles(parser: PropParser, virtualFiles: any, homeDir: string): Promise<BundleData> {
        let tsMode = false;
        let collect = (list) => {
            let data = new Map<string, IBundleInformation>();
            return each(list, (withDeps, filePattern) => {
                if (filePattern.match(/^[a-z0-9_\-@\/]+$/i)) { // check for a valid node module name
                    data.set(filePattern, {
                        deps: withDeps,
                        nodeModule: true,
                    });
                    return;
                }

                let fp = path.join(homeDir, filePattern);
                let extname = path.extname(fp);

                // Switching to typescript mode
                if (extname === ".ts" || extname === ".tsx") {
                    tsMode = true;
                }
                if (!extname && !filePattern.match(/\.js$/)) {
                    fp += ".js";
                }
                return new Promise((resolve, reject) => {
                    glob(fp, (err, files) => {
                        for (let i = 0; i < files.length; i++) {
                            data.set(files[i].normalize("NFC"), {
                                deps: withDeps,
                            });
                        }
                        return resolve();
                    });
                });
            }).then(x => {
                return data;
            });
        };

        return chain(class extends Chainable {
            public tempFolder: string;
            public prepareVirtualFiles() {
                if (virtualFiles) {
                    this.tempFolder = path.join(Config.TEMP_FOLDER, "virtual-files", new Date().getTime().toString());
                    homeDir = this.tempFolder;
                    fsExtra.ensureDirSync(this.tempFolder);

                    return each(virtualFiles, (fileContents, fileName) => {
                        if (utils.isFunction(fileContents)) {
                            fileContents = fileContents();
                        }
                        let filePath = path.join(this.tempFolder, fileName);
                        let fileDir = path.dirname(filePath);
                        fsExtra.ensureDirSync(fileDir);
                        fs.writeFileSync(filePath, fileContents);
                    });
                }
            }
            public setTempFolder() {
                return this.tempFolder;
            }

            public setIncluding() {
                return collect(parser.including);
            }
            public setExcluding() {
                return collect(parser.excluding);
            }

            public setDepsOnly() {
                return collect(parser.depsOnly);
            }

            public setEntry() {
                let keys = Object.keys(parser.entry);
                if (keys.length) {
                    return keys[0];
                }
            }
        }).then(result => {
            let data = new BundleData();
            data.homeDir = homeDir;
            data.typescriptMode = tsMode;
            data.including = result.including;
            data.excluding = result.excluding;
            data.depsOnly = result.depsOnly;
            data.entry = result.entry;
            data.standalone = parser.standalone;
            data.cache = parser.cache;
            if (result.tempFolder) {
                data.setupTempFolder(result.tempFolder);
            }
            return data;
        });
    }
}
