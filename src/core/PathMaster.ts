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
const isRelative = /^[\.\/\\]+$/
const jsExtensions = ['js', 'jsx'];
const tsExtensions = jsExtensions.concat(['ts', 'tsx']);

export interface INodeModuleRequire {
    name: string;
    fuseBoxPath?: string;
    target?: string;
}

export interface IPathInformation {
    fuseBoxAlias?: string;
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
    bundleData?: BundleData;
    entry: string;
    version: string;
    jsNext?: boolean;
    root: string;
    entryRoot: string,
    custom: boolean;
    browserOverrides?: any;
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
    public static list: Set<string> = new Set([".js", ".jsx", ".ts", ".tsx", ".json", ".xml", ".css", ".html"]);

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
    private fuseBoxAlias: string;

    constructor(public context: WorkFlowContext, public rootPackagePath?: string) { }

    public init(name: string, fuseBoxPath?: string) {
        const resolved = this.resolve(name, this.rootPackagePath);
        if (fuseBoxPath) {
            resolved.fuseBoxPath = fuseBoxPath;
        }
        return resolved;
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
                const absPath = this.getAbsolutePath(info.target, data.nodeModuleInfo.root, undefined, true);
                if (absPath.alias) {
                    data.fuseBoxAlias = absPath.alias;
                }
                data.absPath = absPath.resolved;
                data.absDir = path.dirname(data.absPath);
                data.nodeModuleExplicitOriginal = info.target;
            } else {
                data.absPath = data.nodeModuleInfo.entry;
                data.absDir = data.nodeModuleInfo.root;
            }

            if (data.absPath) {
                data.fuseBoxPath = this.getFuseBoxPath(data.absPath, data.nodeModuleInfo.root);
            }
            if (this.fuseBoxAlias) {
                data.fuseBoxPath = this.fuseBoxAlias;
            }

        } else {
            if (root) {
                const absPath = this.getAbsolutePath(name, root, rootEntryLimit);
                if (absPath.alias) {
                    data.fuseBoxAlias = absPath.alias;
                }
                data.absPath = absPath.resolved;
                data.absDir = path.dirname(data.absPath);
                data.fuseBoxPath = this.getFuseBoxPath(data.absPath, this.rootPackagePath);
                if (path.relative(this.rootPackagePath, data.absPath).match(/^\.\.(\\|\/)/)) {
                    this.context.fuse.producer.addWarning('unresolved',
                        `File "${data.absPath}" cannot be bundled because it's out of your project directory (homeDir)`);
                }
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
    public getAbsolutePath(name: string, root: string, rootEntryLimit?: string, explicit = false): {
        resolved: string,
        alias?: string
    } {

        const data = this.ensureFolderAndExtensions(name, root, explicit);
        const url = data.resolved;
        const alias = data.alias;

        let result = path.resolve(root, url);


        // Fixing node_modules package .json limits.
        if (rootEntryLimit && name.match(/\.\.\/$/)) {
            if (result.indexOf(path.dirname(rootEntryLimit)) < 0) {
                return { resolved: rootEntryLimit, alias: alias };
            }
        }
        const output = { resolved: result, alias: alias };
        //RESOLUTION_CACHE.set(cacheKey, output);
        return output;
    }

    public getParentFolderName(): string {
        if (this.rootPackagePath) {
            let s = this.rootPackagePath.split(/\/|\\/g);
            return s[s.length - 1];
        }
        return "";
    }

    private testFolder(folder: string, name: string) {
        let extensions = jsExtensions;
        if (this.tsMode) {
            extensions = tsExtensions
        }

        if (fs.existsSync(folder)) {
            for (let i = 0; i < extensions.length; i++) {
                const index = "index." + extensions[i]
                if (fs.existsSync(path.join(folder, index))) {
                    const result = path.join(name, index);
                    const [a, b] = name
                    if (a === "." && b !== ".") {
                        //add relative './' from `name`, back onto joined path
                        return "./" + result;
                    }
                    return result;
                }
            }
        }
    }

    private checkFileName(root: string, name: string) {
        let extensions = jsExtensions;
        if (this.tsMode) {
            extensions = tsExtensions;
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

    private ensureNodeModuleExtension(input: string) {
        let ext = path.extname(input);
        if (!ext && !isRelative.test(input)) {
            return input + ".js";
        }
        return input;
    }

    private ensureFolderAndExtensions(name: string, root: string, explicit = false): { resolved: string, alias?: string } {

        let ext = path.extname(name);
        let fileExt = this.tsMode && !explicit ? ".ts" : ".js";

        if (name[0] === "~" && name[1] === "/" && this.rootPackagePath) {
            name = "." + name.slice(1, name.length);
            name = path.join(this.rootPackagePath, name);
        }
        //if (explicit) {

        if (!ext) {
            // handle cases with
            // require("@angular/platform-browser/animations");
            // where animation contains package.json pointing to a different file
            const folderJsonPath = path.join(root, name, "package.json");

            if (fs.existsSync(folderJsonPath)) {
                const folderJSON = require(folderJsonPath);
                if (folderJSON.main) {
                    return {
                        resolved: path.resolve(root, name, folderJSON.main),
                        alias: this.ensureNodeModuleExtension(name)
                    }
                }
            }
        }
        //}

        if (!AllowedExtenstions.has(ext)) {
            let fileNameCheck = this.checkFileName(root, name);
            if (fileNameCheck) {
                return { resolved: fileNameCheck };
            } else {
                let folder = path.isAbsolute(name) ? name : path.join(root, name);
                const folderPath = this.testFolder(folder, name);
                if (folderPath) {
                    return { resolved: folderPath }
                } else {
                    name += fileExt;
                    return { resolved: name };
                }
            }
        }
        return { resolved: name };
    }

    private getNodeModuleInfo(name: string): INodeModuleRequire {
        // Handle scope requires
        if (name[0] === "@") {
            let s = name.split("/");
            let target = s.splice(2, s.length).join("/");
            // let fuseBoxPath;
            // if (target) {
            //     fuseBoxPath = this.ensureNodeModuleExtension(target);
            // }
            return {
                name: `${s[0]}/${s[1]}`,
                target: target
            };
        }
        let data = name.split(/\/(.+)?/);
        return {
            name: data[0],
            target: data[1],
        };
    }

    private fixBrowserOverrides(browserOverrides: { [key: string]: string }): { [key: string]: string } {
        let newOverrides = {};
        for (let key in browserOverrides) {
            let value = browserOverrides[key];
            if (typeof value === "string") {
                if (/\.\//.test(key)) {
                    key = key.slice(2);
                }
                if (/\.\//.test(value)) {
                    value = "~/" + value.slice(2);
                } else {
                    value = "~/" + value;
                }
                if (!/.js$/.test(value)) {
                    value = value + ".js";
                }
            }

            newOverrides[key] = value;
        }
        return newOverrides;
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
                let jsNext = false;
                let browserOverrides;
                if (this.context.target !== "server") {
                    if (json.browser && !this.context.isBrowserTarget()) {
                        this.context.fuse.producer.addWarning("json.browser",
                            `Library "${name}" contains "browser" field. Set .target("browser") to avoid problems with your browser build!`);
                    }
                }
                if (this.context.isBrowserTarget() && json.browser) {
                    if (typeof json.browser === "object") {
                        browserOverrides = this.fixBrowserOverrides(json.browser);
                        if (json.browser[json.main]) {
                            entryFile = json.browser[json.main];
                        }
                    }
                    if (typeof json.browser === "string") {
                        entryFile = json.browser;
                    }
                }

                if (this.context.shouldUseJsNext(name) && (json["jsnext:main"] || json.module)) {
                    jsNext = true;
                    entryFile = path.join(folder, json["jsnext:main"] || json.module);
                } else {
                    entryFile = path.join(folder, entryFile || json.main || "index.js");
                }
                entryRoot = path.dirname(entryFile);

                return {
                    browserOverrides: browserOverrides,
                    name,
                    jsNext,
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

        // handle a conflicting library
        if (this.rootPackagePath) {
            let nodeModules = path.join(this.rootPackagePath, "node_modules");
            let nestedNodeModule = path.join(nodeModules, name);

            if (fs.existsSync(nestedNodeModule)) {
                return readMainFile(nestedNodeModule, nodeModules !== Config.NODE_MODULES_DIR);
            } else {
                // climb up (sometimes it can be in a parent)
                let upperNodeModule = path.join(this.rootPackagePath, "../", name);
                if (path.dirname(upperNodeModule) !== Config.NODE_MODULES_DIR) {
                    if (fs.existsSync(upperNodeModule)) {
                        let isCustom = false;
                        if (path.dirname(upperNodeModule).match(/node_modules$/)) {
                            isCustom = path.dirname(this.rootPackagePath) !== Config.NODE_MODULES_DIR;
                            return readMainFile(upperNodeModule, isCustom);
                        }
                    }
                }

            }
        }

        return readMainFile(modulePath, false);

    }
}
