
import { IPackageInformation, IPathInformation } from './PathMaster';
import { WorkFlowContext } from "./WorkflowContext";
import * as path from "path";
import * as fs from "fs";
import { Config } from "./Config";
const NODE_MODULE = /^([a-z@].*)$/;
export interface INodeModuleRequire {
    name: string;
    target?: string;
}

export interface IPathInformation {
    isRemoteFile?: boolean;
    remoteURL?: string;
    isNodeModule: boolean;
    nodeModuleName?: string;
    nodeModuleInfo?: IPackageInformation;
    nodeModuleExplicitOriginal?: string;
    absDir?: string;
    fuseBoxPath?: string;
    absPath?: string;
}

export interface IPackageInformation {
    name: string;
    missing?: boolean;
    entry: string;
    version: string;
    root: string;
    entryRoot: string,
    custom: boolean;
    customBelongsTo?: string;
}

export class AllowedExtenstions {
    public static list: Set<string> = new Set([".js", ".ts", ".json", ".xml", ".css", ".html"]);
    public static add(name: string) {
        if (!this.list.has(name)) {
            this.list.add(name);
        }
    }

    public static has(name) {
        return this.list.has(name);
    }
}
/**
 * PathMaster
 */
export class PathMaster {

    private tsMode = false;

    constructor(public context: WorkFlowContext, public rootPackagePath?: string) { }

    public init(name: string) {
        return this.resolve(name, this.rootPackagePath);
    }

    public setTypeScriptMode() {
        this.tsMode = true;
    }

    public resolve(name: string, root: string, rootEntryLimit?: string): IPathInformation {

        let data = <IPathInformation>{};

        if (/^(http(s)?:|\/\/)/.test(name)) {
            data.isRemoteFile = true;
            data.remoteURL = name;
            data.absPath = name;
            return data;
        }
        data.isNodeModule = NODE_MODULE.test(name);

        if (data.isNodeModule) {

            let info = this.getNodeModuleInfo(name);
            data.nodeModuleName = info.name;

            // A trick to avoid one nasty situation
            // Imagine lodash@1.0.0 that is set as a custom depedency for 2 libraries
            // We need to make sure there, that we use one source (either or)
            // We don't want to take modules from 2 different places (in case if versions match) 
            let nodeModuleInfo = this.getNodeModuleInformation(info.name);
            let cachedInfo = this.context.getLibInfo(nodeModuleInfo.name, nodeModuleInfo.version);
            if (cachedInfo) { // Modules has been defined already
                data.nodeModuleInfo = cachedInfo;
            } else {
                data.nodeModuleInfo = nodeModuleInfo; // First time that module is mentioned
                // Caching module information
                // Which will override paths
                this.context.setLibInfo(nodeModuleInfo.name, nodeModuleInfo.version, nodeModuleInfo);
            }

            if (info.target) {
                // Explicit require from a libary e.g "lodash/dist/each" -> "dist/each"
                data.absPath = this.getAbsolutePath(info.target, data.nodeModuleInfo.root, undefined, true);
                data.absDir = path.dirname(data.absPath);
                data.nodeModuleExplicitOriginal = info.target;
            } else {
                data.absPath = data.nodeModuleInfo.entry;
                data.absDir = data.nodeModuleInfo.root;
            }
            if (data.absPath) {
                data.fuseBoxPath = this.getFuseBoxPath(data.absPath, data.nodeModuleInfo.root);
            }

        } else {
            if (root) {
                data.absPath = this.getAbsolutePath(name, root, rootEntryLimit);
                data.absDir = path.dirname(data.absPath);
                data.fuseBoxPath = this.getFuseBoxPath(data.absPath, this.rootPackagePath);
            }
        }

        return data;
    }

    public getFuseBoxPath(name: string, root: string) {
        if (!root) {
            return;
        }
        name = name.replace(/\\/g, "/");
        root = root.replace(/\\/g, "/");
        name = name.replace(root, "").replace(/^\/|\\/, "");
        if (this.tsMode) {
            name = this.context.convert2typescript(name);
        }
        return name;
    }

    /**
     * Make sure that all extensions are in place
     * Returns a valid absolute path
     *
     * @param {string} name
     * @param {string} root
     * @returns
     *
     * @memberOf PathMaster
     */
    public getAbsolutePath(name: string, root: string, rootEntryLimit?: string, explicit = false) {
        let url = this.ensureFolderAndExtensions(name, root, explicit);
        let result = path.resolve(root, url);

        // Fixing node_modules package .json limits.
        if (rootEntryLimit && name.match(/\.\.\/$/)) {
            if (result.indexOf(path.dirname(rootEntryLimit)) < 0) {
                return rootEntryLimit;
            }
        }
        return result;
    }

    public getParentFolderName(): string {
        if (this.rootPackagePath) {
            let s = this.rootPackagePath.split(/\/|\\/g);
            return s[s.length - 1];
        }
        return "";
    }


    private ensureFolderAndExtensions(name: string, root: string, explicit = false) {
        let ext = path.extname(name);
        let fileExt = this.tsMode && !explicit ? ".ts" : ".js";

        if (name[0] === "~" && name[1] === "/" && this.rootPackagePath) {
            name = "." + name.slice(1, name.length);
            name = path.join(this.rootPackagePath, name);
        }
        if (!AllowedExtenstions.has(ext)) {
            if (/\/$/.test(name)) {
                return `${name}index${fileExt}`;
            }
            let folderDir = path.isAbsolute(name) ? path.join(name, `index${fileExt}`)
                : path.join(root, name, `index${fileExt}`);

            if (fs.existsSync(folderDir)) {
                let startsWithDot = name[0] === "."; // After transformation we need to bring the dot back
                name = path.join(name, "/", `index${fileExt}`); // detecting a real relative path
                if (startsWithDot) {
                    // making sure we are not modifying it and converting to
                    // what can be take for node_module
                    // For example: ./foo if a folder, becomes "foo/index.js",
                    // whereas foo can be interpreted as node_module
                    name = `./${name}`;
                }
            } else {
                name += fileExt;
            }
        }
        return name;
    }



    private getNodeModuleInfo(name: string): INodeModuleRequire {
        // Handle scope requires
        if (name[0] === "@") {
            let s = name.split("/");
            let target = s.splice(2, s.length).join("/");
            return {
                name: `${s[0]}/${s[1]}`,
                target: target || undefined,
            };
        }
        let data = name.split(/\/(.+)?/);
        return {
            name: data[0],
            target: data[1],
        };
    }

    private getNodeModuleInformation(name: string): IPackageInformation {

        let readMainFile = (folder, isCustom: boolean) => {
            // package.json path
            let packageJSONPath = path.join(folder, "package.json");
            if (fs.existsSync(packageJSONPath)) {
                // read contents
                let json: any = require(packageJSONPath);
                // Getting an entry point
                let entryFile;
                let entryRoot;
                if (json.main) {
                    entryFile = path.join(folder, json.main);
                } else {
                    entryFile = path.join(folder, "index.js");
                }

                entryRoot = path.dirname(entryFile);
                return {
                    name: name,
                    custom: isCustom,
                    root: folder,
                    missing: false,
                    entryRoot: entryRoot,
                    entry: entryFile,
                    version: json.version,
                };
            }
            let defaultEntry = path.join(folder, "index.js");
            let entryFile = fs.existsSync(defaultEntry) ? defaultEntry : undefined;
            let defaultEntryRoot = entryFile ? path.dirname(entryFile) : undefined;
            let packageExists = fs.existsSync(folder);
            return {
                name: name,
                missing: !packageExists,
                custom: isCustom,
                root: folder,
                entry: entryFile,
                entryRoot: defaultEntryRoot,
                version: "0.0.0",
            };
        };
        let localLib = path.join(Config.LOCAL_LIBS, name);
        let modulePath = path.join(Config.NODE_MODULES_DIR, name);

        if (this.context.customModulesFolder) {
            let customFolder = path.join(this.context.customModulesFolder, name);
            if (fs.existsSync(customFolder)) {
                return readMainFile(customFolder, false);
            }
        }

        if (this.rootPackagePath) {// handle a conflicting library

            let nestedNodeModule = path.join(this.rootPackagePath, "node_modules", name);
            if (fs.existsSync(nestedNodeModule)) {
                return readMainFile(nestedNodeModule, true);
            } else {
                // climb up (sometimes it can be in a parent)
                let upperNodeModule = path.join(this.rootPackagePath, "../", name);
                if (fs.existsSync(upperNodeModule)) {
                    let isCustom = path.dirname(this.rootPackagePath) !== Config.NODE_MODULES_DIR;
                    return readMainFile(upperNodeModule, isCustom);
                }
            }
        }
        if (fs.existsSync(localLib)) {
            return readMainFile(localLib, false);
        } else {
            return readMainFile(modulePath, false);
        }
    }
}
