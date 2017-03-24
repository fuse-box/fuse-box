import { IPackageInformation, IPathInformation } from "./PathMaster";
import { WorkFlowContext } from "./WorkflowContext";
import { ensurePublicExtension } from "../Utils";
import { Config } from "../Config";
import * as path from "path";
import * as fs from "fs";
import { BundleData } from "../arithmetic/Arithmetic";

/**
 * If a import url isn't relative
 * and only has ascii + @ in the name it is considered a node module
 */
const NODE_MODULE = /^([a-z@](?!:).*)$/;

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
    params?: Map<string, string>;
    absPath?: string;
}

export interface IPackageInformation {
    name: string;
    missing?: boolean;
    bundleData?: BundleData​​;
    entry: string;
    version: string;
    root: string;
    entryRoot: string,
    custom: boolean;
    customBelongsTo?: string;
}

/**
 * Manages the allowed extensions e.g.
 * should user be allowed to do `require('./foo.ts')`
 */
export class AllowedExtenstions {
    /**
     * Users are allowed to require files with these extensions by default
     **/
    public static list: Set<string> = new Set([".js", ".ts", ".tsx", ".json", ".xml", ".css", ".html"]);

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

    private tsMode: boolean = false;

    constructor(public context: WorkFlowContext, public rootPackagePath?: string) { }

    public init(name: string) {
        return this.resolve(name, this.rootPackagePath);
    }

    public setTypeScriptMode() {
        this.tsMode = true;
    }

    public resolve(name: string, root?: string, rootEntryLimit?: string): IPathInformation {

        let data = <IPathInformation>{};

        if (/^(http(s)?:|\/\/)/.test(name)) {
            data.isRemoteFile = true;
            data.remoteURL = name;
            data.absPath = name;
            return data;
        }

        // if (/\?/.test(name)) {
        //     let paramsSplit = name.split(/\?(.+)/);
        //     name = paramsSplit[0];
        //     data.params = parseQuery(paramsSplit[1]);
        // }
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
            name = ensurePublicExtension(name);
        }
        // Some smart asses like "react-router"
        // Skip .js for their main entry points.
        // HATE HATE HATE
        let ext = path.extname(name);
        if (!ext) {
            name += ".js";
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

        // A check for tsx
        // Simple a hack..
        // ensureFolderAndExtensions needs to be re-writted
        // We should list a folder and pick matching file
        // if (this.tsMode) {
        //     if (!fs.existsSync(result)) {
        //         let tsxVersion = replaceExt(result, ".tsx");
        //         if (fs.existsSync(tsxVersion)) {
        //             return tsxVersion;
        //         } else {
        //             // yet another hack
        //             // final check for .js extension
        //             // I know, it's not pretty ;-( Let's find a way to fix that
        //             let jsVersion = replaceExt(result, ".js");
        //             return jsVersion;
        //         }
        //     }
        // }

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

    private testFolder(folder: string, name: string) {
        const extensions = ["js", "jsx"];
        if (this.tsMode) {
            extensions.push("ts", "tsx");
        }

        if (fs.existsSync(folder)) {
            for (let i = 0; i < extensions.length; i++) {
                let ext = extensions[i];
                const index = `index.${ext}`;
                const target = path.join(folder, index);
                if (fs.existsSync(target)) {
                    let result = path.join(name, index);
                    let startsWithDot = result[0] === "."; // After transformation we need to bring the dot back
                    if (startsWithDot) {
                        result = `./${result}`;
                    }
                    return result;
                }
            }
        }
    }

    private checkFileName(root: string, name: string) {
        const extensions = ["js", "jsx"];
        if (this.tsMode) {
            extensions.push("ts", "tsx");
        }
        for (let i = 0; i < extensions.length; i++) {
            let ext = extensions[i];
            let fileName = `${name}.${ext}`;
            let target = path.isAbsolute(name) ? fileName : path.join(root, fileName);
            if (fs.existsSync(target)) {
                if (fileName[0] === ".") {
                    fileName = `./${fileName}`;
                }
                return fileName;
            }
        }
    }

    private ensureFolderAndExtensions(name: string, root: string, explicit = false) {
        // Would be great to list a folder and prob for a file.
        // So, let's say, user did not specify an extension
        // So we list a folder, get something like this:
        // .
        // target.jsx
        // target.tsx
        // target.ts
        // In case of tsMode we choose target.ts if available
        //      if target.ts is missing, we choose target.tsx and so on

        let ext = path.extname(name);
        let fileExt = this.tsMode && !explicit ? ".ts" : ".js";

        if (name[0] === "~" && name[1] === "/" && this.rootPackagePath) {
            name = "." + name.slice(1, name.length);
            name = path.join(this.rootPackagePath, name);
        }

        if (!AllowedExtenstions.has(ext)) {
            let folder = path.isAbsolute(name) ? name : path.join(root, name);
            const folderPath = this.testFolder(folder, name);
            if (folderPath) {
                return folderPath;
            } else {
                let fileNameCheck = this.checkFileName(root, name);
                if (fileNameCheck) {
                    return fileNameCheck;
                } else {
                    name += fileExt;
                }
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

        const readMainFile = (folder, isCustom: boolean) => {
            // package.json path
            const packageJSONPath = path.join(folder, "package.json");
            if (fs.existsSync(packageJSONPath)) {
                // read contents
                const json: any = require(packageJSONPath);
                // Getting an entry point
                let entryFile;
                let entryRoot;
                if (json.browser) {
                    if (typeof json.browser === "object" && json.browser[json.main]) {
                        entryFile = json.browser[json.main];
                    }
                    if (typeof json.browser === "string") {
                        entryFile = json.browser;
                    }
                }
                if (this.context.rollupOptions && json["jsnext:main"]) {
                    entryFile = path.join(folder, json["jsnext:main"]);
                } else {
                    entryFile = path.join(folder, entryFile || json.main || "index.js");
                    entryRoot = path.dirname(entryFile);
                }
                return {
                    name,
                    custom: isCustom,
                    root: folder,
                    missing: false,
                    entryRoot,
                    entry: entryFile,
                    version: json.version,
                };
            }

            let defaultEntry = path.join(folder, "index.js");
            let entryFile = fs.existsSync(defaultEntry) ? defaultEntry : undefined;
            let defaultEntryRoot = entryFile ? path.dirname(entryFile) : undefined;
            let packageExists = fs.existsSync(folder);
            return {
                name,
                missing: !packageExists,
                custom: isCustom,
                root: folder,
                entry: entryFile,
                entryRoot: defaultEntryRoot,
                version: "0.0.0",
            };
        };

        let localLib = path.join(Config.FUSEBOX_MODULES, name);
        let modulePath = path.join(Config.NODE_MODULES_DIR, name);
        // check for custom shared packages
        const producer = this.context.bundle && this.context.bundle.producer
        if (producer && producer.isShared(name)) {
            let shared = producer.getSharedPackage(name);

            return {
                name,
                custom: false,
                bundleData: shared.data,
                root: shared.homeDir,
                entry: shared.mainPath,
                entryRoot: shared.mainDir,
                version: "0.0.0",
            }
        }

        if (this.context.customModulesFolder) {
            let customFolder = path.join(this.context.customModulesFolder, name);
            if (fs.existsSync(customFolder)) {
                return readMainFile(customFolder, false);
            }
        }

        if (fs.existsSync(localLib)) {
            return readMainFile(localLib, false);
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

        return readMainFile(modulePath, false);

    }
}
