import * as path from "path";
import * as fs from "fs";
import { BundleSource } from "./BundleSource";
import { File } from "./File";
import { Log } from "./Log";
import { IPackageInformation, IPathInformation, AllowedExtenstions } from "./PathMaster";
import { ModuleCollection } from "./ModuleCollection";
import { ModuleCache } from "./ModuleCache";
import { utils } from "realm-utils";
import { EventEmitter } from "events";

const appRoot = require("app-root-path");

const mkdirp = require("mkdirp");
/**
 * 
 * 
 * @export
 * @interface Plugin
 */
export interface Plugin {
    /**
     * 
     * 
     * @type {RegExp}
     * @memberOf Plugin
     */
    test?: RegExp;
    /**
     * 
     * 
     * @type {string[]}
     * @memberOf Plugin
     */
    dependencies?: string[];


    /**
     * 
     * 
     * @type {{ (context: WorkFlowContext) }}
     * @memberOf Plugin
     */
    init?: { (context: WorkFlowContext) };
    /**
     * 
     * 
     * @type {{ (file: File, ast?: any) }}
     * @memberOf Plugin
     */
    transform?: { (file: File, ast?: any) };


    transformGroup?: { (file: File) };
    /**
     * 
     * 
     * @param {WorkFlowContext} context
     * 
     * @memberOf Plugin
     */
    bundleStart?(context: WorkFlowContext);
    /**
     * 
     * 
     * @param {WorkFlowContext} context
     * 
     * @memberOf Plugin
     */
    bundleEnd?(context: WorkFlowContext);
}

/**
 * WorkFlowContext
 */
/**
 * 
 * 
 * @export
 * @class WorkFlowContext
 */
export class WorkFlowContext {


    public shim: any;

    /**
     * 
     * 
     * 
     * @memberOf WorkFlowContext
     */
    public emmitter = new EventEmitter();
    /**
     * 
     * 
     * 
     * @memberOf WorkFlowContext
     */
    public defaultPackageName = "default";

    /**
     * 
     * 
     * @type {string[]}
     * @memberOf WorkFlowContext
     */
    public ignoreGlobal: string[] = [];
    /**
     * 
     * 
     * @type {Map<string, ModuleCollection>}
     * @memberOf WorkFlowContext
     */
    public nodeModules: Map<string, ModuleCollection> = new Map();
    /**
     * 
     * 
     * @type {Map<string, IPackageInformation>}
     * @memberOf WorkFlowContext
     */
    public libPaths: Map<string, IPackageInformation> = new Map();
    /**
     * 
     * 
     * @type {string}
     * @memberOf WorkFlowContext
     */
    public homeDir: string;
    /**
     * 
     * 
     * 
     * @memberOf WorkFlowContext
     */
    public printLogs = true;
    /**
     * 
     * 
     * @type {Plugin[]}
     * @memberOf WorkFlowContext
     */
    public plugins: Plugin[];

    public fileGroups: Map<string, File>;
    /**
     * 
     * 
     * 
     * @memberOf WorkFlowContext
     */
    public useCache = true;
    /**
     * 
     * 
     * 
     * @memberOf WorkFlowContext
     */
    public doLog = true;
    /**
     * 
     * 
     * 
     * @memberOf WorkFlowContext
     */
    public cache: ModuleCache;
    /**
     * 
     * 
     * @type {*}
     * @memberOf WorkFlowContext
     */
    public tsConfig: any;
    /**
     * 
     * 
     * @type {string}
     * @memberOf WorkFlowContext
     */
    public customModulesFolder: string;
    /**
     * 
     * 
     * 
     * @memberOf WorkFlowContext
     */
    public tsMode = false;
    /**
     * 
     * 
     * @type {string[]}
     * @memberOf WorkFlowContext
     */
    public globals: any;
    /**
     * 
     * 
     * @type {boolean}
     * @memberOf WorkFlowContext
     */
    public standaloneBundle: boolean = true;
    /**
     * 
     * 
     * @type {BundleSource}
     * @memberOf WorkFlowContext
     */
    public source: BundleSource;
    /**
     * 
     * 
     * @type {*}
     * @memberOf WorkFlowContext
     */
    public sourceMapConfig: any;
    /**
     * 
     * 
     * @type {string}
     * @memberOf WorkFlowContext
     */
    public outFile: string;

    public initialLoad = true;

    /**
     * 
     * 
     * @type {Log}
     * @memberOf WorkFlowContext
     */
    public log: Log = new Log(this.doLog)

    public pluginTriggers: Map<string, Set<String>>;

    public storage: Map<string, any>;
    public initCache() {
        this.cache = new ModuleCache(this);
    }

    public emitJavascriptHotReload(file: File) {
        this.emmitter.emit("source-changed", {
            type: "js",
            content: file.contents,
            path: file.info.fuseBoxPath,
        });
    }

    /**
     * 
     * 
     * @param {string} name
     * @returns {boolean}
     * 
     * @memberOf WorkFlowContext
     */
    public isShimed(name: string): boolean {
        if (!this.shim) {
            return false;
        }
        return this.shim[name] !== undefined;
    }


    /**
     * 
     * 
     * 
     * @memberOf WorkFlowContext
     */
    public reset() {
        this.log = new Log(this.doLog);
        this.storage = new Map();
        this.source = new BundleSource(this);
        this.nodeModules = new Map();
        this.pluginTriggers = new Map();
        this.fileGroups = new Map();
        this.libPaths = new Map();
    }

    public setItem(key: string, obj: any) {
        this.storage.set(key, obj);
    }

    public getItem(key: string): any {
        return this.storage.get(key);
    }

    /**
     * Create a new file group
     * Mocks up file
     * 
     * @param {string} name
     * 
     * @memberOf WorkFlowContext
     */
    public createFileGroup(name: string): File {
        let info = <IPathInformation>{
            fuseBoxPath: name,
            absPath: name,
        }
        let file = new File(this, info);
        file.contents = "";
        file.groupMode = true;
        this.fileGroups.set(name, file);
        return file;
    }


    public getFileGroup(name: string): File {
        return this.fileGroups.get(name);
    }
    /**
     * 
     * 
     * @param {string} ext
     * 
     * @memberOf WorkFlowContext
     */
    public allowExtension(ext: string) {
        AllowedExtenstions.add(ext);
    }
    /**
     * 
     * 
     * @param {string} dir
     * 
     * @memberOf WorkFlowContext
     */
    public setHomeDir(dir: string) {
        this.homeDir = dir;
    }

    /**
     * 
     * 
     * @param {string} name
     * @param {string} version
     * @param {IPackageInformation} info
     * @returns
     * 
     * @memberOf WorkFlowContext
     */
    public setLibInfo(name: string, version: string, info: IPackageInformation) {
        let key = `${name}@${version}`;
        if (!this.libPaths.has(key)) {
            return this.libPaths.set(key, info);
        }
    }

    /**
     * 
     * 
     * @param {string} name
     * @returns
     * 
     * @memberOf WorkFlowContext
     */
    public convert2typescript(name: string) {
        return name.replace(/\.ts$/, ".js");
    }
    /**
     * 
     * 
     * @param {string} name
     * @param {string} version
     * @returns {IPackageInformation}
     * 
     * @memberOf WorkFlowContext
     */
    public getLibInfo(name: string, version: string): IPackageInformation {
        let key = `${name}@${version}`;
        if (this.libPaths.has(key)) {
            return this.libPaths.get(key);
        }
    }

    /**
     * 
     * 
     * @param {any} printLogs
     * 
     * @memberOf WorkFlowContext
     */
    public setPrintLogs(printLogs) {
        this.printLogs = printLogs;
    }

    /**
     * 
     * 
     * @param {boolean} useCache
     * 
     * @memberOf WorkFlowContext
     */
    public setUseCache(useCache: boolean) {
        this.useCache = useCache;
    }

    /**
     * 
     * 
     * @param {string} name
     * @returns
     * 
     * @memberOf WorkFlowContext
     */
    public hasNodeModule(name: string) {
        return this.nodeModules.has(name);
    }

    public isGlobalyIgnored(name: string) {
        return this.ignoreGlobal.indexOf(name) > -1;
    }

    /**
     * 
     * 
     * @param {string} name
     * @param {ModuleCollection} collection
     * 
     * @memberOf WorkFlowContext
     */
    public addNodeModule(name: string, collection: ModuleCollection) {
        this.nodeModules.set(name, collection);
    }

    /**
     * 
     * 
     * @returns
     * 
     * @memberOf WorkFlowContext
     */
    public getTypeScriptConfig() {
        if (this.tsConfig) {
            return this.tsConfig;
        }
        let url = path.join(this.homeDir, "tsconfig.json");
        if (fs.existsSync(url)) {
            this.tsConfig = require(url);
        } else {
            this.tsConfig = {
                compilerOptions: {}
            };
        }
        this.tsConfig.compilerOptions.module = "commonjs";
        if (this.sourceMapConfig) {
            this.tsConfig.compilerOptions.sourceMap = true;
            this.tsConfig.compilerOptions.inlineSources = true;
        }
        return this.tsConfig;
    }

    public isFirstTime() {
        return this.initialLoad === true;
    }

    /**
     * 
     * 
     * @param {string} userPath
     * @returns
     * 
     * @memberOf WorkFlowContext
     */
    public ensureUserPath(userPath: string) {
        if (!path.isAbsolute(userPath)) {
            userPath = path.join(appRoot.path, userPath);
        }
        let dir = path.dirname(userPath);
        mkdirp.sync(dir);
        return userPath;
    }

    /**
     * 
     * 
     * 
     * @memberOf WorkFlowContext
     */
    public writeOutput(fn?: any) {
        this.initialLoad = false;
        let res = this.source.getResult();
        // Writing sourcemaps
        if (this.sourceMapConfig && this.sourceMapConfig.outFile) {
            let target = this.ensureUserPath(this.sourceMapConfig.outFile);
            fs.writeFile(target, res.sourceMap, () => { });
        }
        // writing target
        if (this.outFile) {
            let target = this.ensureUserPath(this.outFile);
            fs.writeFile(target, res.content, () => {
                if (utils.isFunction(fn)) {
                    fn();
                }
            });
        }
    }

    /**
     * 
     * 
     * @param {string} name
     * @returns {ModuleCollection}
     * 
     * @memberOf WorkFlowContext
     */
    public getNodeModule(name: string): ModuleCollection {
        return this.nodeModules.get(name);
    }

    /**
     * 
     * 
     * @param {string} name
     * @param {*} args
     * 
     * @memberOf WorkFlowContext
     */
    public triggerPluginsMethodOnce(name: string, args: any, fn?: { (plugin: Plugin) }) {
        this.plugins.forEach(plugin => {
            if (Array.isArray(plugin)) {
                plugin.forEach(p => {
                    if (utils.isFunction(p[name])) {
                        if (this.pluginRequiresTriggering(p, name)) {
                            p[name].apply(p, args);
                            if (fn) {
                                fn(p);
                            }
                        }
                    }
                });
            }
            if (utils.isFunction(plugin[name])) {
                if (this.pluginRequiresTriggering(plugin, name)) {
                    plugin[name].apply(plugin, args);
                    if (fn) {
                        fn(plugin);
                    }
                }
            }
        });
    }
    /**
     * Make sure plugin method is triggered only once
     * 
     * @private
     * @param {*} cls
     * @param {string} method
     * @returns
     * 
     * @memberOf WorkFlowContext
     */
    private pluginRequiresTriggering(cls: any, method: string) {
        if (!cls.constructor) {
            return true;
        }
        let name = cls.constructor.name;
        if (!this.pluginTriggers.has(name)) {
            this.pluginTriggers.set(name, new Set());
        }
        let items = this.pluginTriggers.get(name);
        if (!items.has(method)) {
            items.add(method);
            return true;
        }
        return false;
    }
}