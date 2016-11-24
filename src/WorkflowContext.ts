import * as path from 'path';
import * as fs from 'fs';
import { BundleSource } from "./BundleSource";
import { File } from "./File";
import { Log } from "./Log";
import { IPackageInformation, AllowedExtenstions } from "./PathMaster";
import { ModuleCollection } from "./ModuleCollection";
import { ModuleCache } from "./ModuleCache";
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
    init: { (context: WorkFlowContext) };
    /**
     * 
     * 
     * @type {{ (file: File, ast?: any) }}
     * @memberOf Plugin
     */
    transform: { (file: File, ast?: any) };
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
    public cache = new ModuleCache(this);
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
    public globals: string[] = [];
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

    /**
     * 
     * 
     * @type {Log}
     * @memberOf WorkFlowContext
     */
    public log: Log;

    /**
     * 
     * 
     * 
     * @memberOf WorkFlowContext
     */
    public reset() {
        this.log = new Log(this.doLog);
        this.source = new BundleSource(this);
        this.nodeModules = new Map();
        this.libPaths = new Map();
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
    public writeOutput() {
        let res = this.source.getResult();
        // Writing sourcemaps
        if (this.sourceMapConfig && this.sourceMapConfig.outFile) {
            let target = this.ensureUserPath(this.sourceMapConfig.outFile);
            fs.writeFile(target, res.sourceMap);
        }
        // writing target
        if (this.outFile) {
            let target = this.ensureUserPath(this.outFile);
            fs.writeFile(target, res.content);
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
}