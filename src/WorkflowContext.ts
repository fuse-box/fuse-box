import * as path from "path";
import * as fs from "fs";
import { BundleSource } from "./BundleSource";
import { File } from "./File";
import { Log } from "./Log";
import { IPackageInformation, IPathInformation, AllowedExtenstions } from "./PathMaster";
import { ModuleCollection } from "./ModuleCollection";
import { ModuleCache } from "./ModuleCache";
import { utils } from "realm-utils";
import { EventEmitter } from "./EventEmitter";
import { ensureUserPath, findFileBackwards } from './Utils';
import { SourceChangedEvent } from './devServer/Server';


/**
 * All the plugin method names
 */
type PluginMethodName =
    'init'
    | 'preBuild'
    | 'preBundle'
    | 'bundleStart'
    | 'bundleEnd'
    | 'postBundle'
    | 'postBuild'

const appRoot = require("app-root-path");

/**
 * Interface for a FuseBox plugin
 */
export interface Plugin {
    test?: RegExp;
    init?: { (context: WorkFlowContext) };
    transform?: { (file: File, ast?: any) };
    transformGroup?: { (file: File) };
    onTypescriptTransform?: { (file: File) };
    bundleStart?(context: WorkFlowContext);
    bundleEnd?(context: WorkFlowContext);

    /**
     * If provided then the dependencies are loaded on the client
     *  before the plugin is invoked
     */
    dependencies?: string[];
}

/**
 * Gets passed to each plugin to track FuseBox configuration
 */
export class WorkFlowContext {
    public shim: any;

    public sourceChangedEmitter = new EventEmitter<SourceChangedEvent>();

    /**
     * The default package name or the package name configured in options
     */
    public defaultPackageName = "default";

    public transformTypescript?: (contents: string) => string;

    public ignoreGlobal: string[] = [];

    /**
     * Explicitly target bundle to server
     */
    public serverBundle = false;

    public nodeModules: Map<string, ModuleCollection> = new Map();

    public libPaths: Map<string, IPackageInformation> = new Map();

    public homeDir: string;

    public printLogs = true;

    public plugins: Plugin[];

    public fileGroups: Map<string, File>;

    public useCache = true;

    public doLog = true;

    public cache: ModuleCache;

    public tsConfig: any;

    public customModulesFolder: string;

    public tsMode = false;

    public loadedTsConfig: string;

    public globals: { [packageName: string]: /** Variable name */ string };

    public standaloneBundle: boolean = true;

    public source: BundleSource;

    public sourceMapConfig: any;

    public outFile: string;

    public initialLoad = true;

    public log: Log = new Log(this.doLog)

    public pluginTriggers: Map<string, Set<String>>;

    public storage: Map<string, any>;

    public initCache() {
        this.cache = new ModuleCache(this);
    }

    public emitJavascriptHotReload(file: File) {
        this.sourceChangedEmitter.emit({
            type: "js",
            content: file.contents,
            path: file.info.fuseBoxPath,
        });
    }

    public isShimed(name: string): boolean {
        if (!this.shim) {
            return false;
        }
        return this.shim[name] !== undefined;
    }


    /**
     * Resets significant class members
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

    public allowExtension(ext: string) {
        if (!AllowedExtenstions.has(ext)) {
            AllowedExtenstions.add(ext);
        }
    }

    public setHomeDir(dir: string) {
        this.homeDir = dir;
    }

    public setLibInfo(name: string, version: string, info: IPackageInformation) {
        let key = `${name}@${version}`;
        if (!this.libPaths.has(key)) {
            return this.libPaths.set(key, info);
        }
    }

    /** Converts the file extension from `.ts` to `.js` */
    public convert2typescript(name: string) {
        return name.replace(/\.ts$/, '.js');
    }

    public getLibInfo(name: string, version: string): IPackageInformation {
        let key = `${name}@${version}`;
        if (this.libPaths.has(key)) {
            return this.libPaths.get(key);
        }
    }

    public setPrintLogs(printLogs: boolean) {
        this.printLogs = printLogs;
    }

    public setUseCache(useCache: boolean) {
        this.useCache = useCache;
    }

    public hasNodeModule(name: string): boolean {
        return this.nodeModules.has(name);
    }

    public isGlobalyIgnored(name: string): boolean {
        return this.ignoreGlobal.indexOf(name) > -1;
    }

    public addNodeModule(name: string, collection: ModuleCollection) {
        this.nodeModules.set(name, collection);
    }


    /** 
     * Retuns the parsed `tsconfig.json` contents
     */
    public getTypeScriptConfig() {
        if (this.loadedTsConfig) {
            return this.loadedTsConfig;
        }

        let url, configFile;
        let config: any = {
            compilerOptions: {}
        };;
        if (this.tsConfig) {
            configFile = ensureUserPath(this.tsConfig);
        } else {
            url = path.join(this.homeDir, "tsconfig.json");
            let tsconfig = findFileBackwards(url, appRoot.path);
            if (tsconfig) {
                configFile = tsconfig;
            }
        }
        if (configFile) {
            this.log.echoStatus(`Typescript config:  ${configFile.replace(appRoot.path, '')}`);
            config = require(configFile);
        } else {
            this.log.echoStatus(`Typescript config file was not found. Improvising`);
        }

        config.compilerOptions.module = "commonjs";
        if (this.sourceMapConfig) {
            config.compilerOptions.sourceMap = true;
            config.compilerOptions.inlineSources = true;
        }
        this.loadedTsConfig = config;
        return config;
    }

    public isFirstTime() {
        return this.initialLoad === true;
    }

    public writeOutput(outFileWritten?: () => any) {
        this.initialLoad = false;
        let res = this.source.getResult();
        // Writing sourcemaps
        if (this.sourceMapConfig && this.sourceMapConfig.outFile) {
            let target = ensureUserPath(this.sourceMapConfig.outFile);
            fs.writeFile(target, res.sourceMap, () => { });
        }
        // writing target
        if (this.outFile) {
            let target = ensureUserPath(this.outFile);
            fs.writeFile(target, res.content, () => {
                if (utils.isFunction(outFileWritten)) {
                    outFileWritten();
                }
            });
        }
    }

    public getNodeModule(name: string): ModuleCollection {
        return this.nodeModules.get(name);
    }

    /**
     * @param fn if provided, its called once the plugin method has been triggered
     */
    public triggerPluginsMethodOnce(name: PluginMethodName, args: any, fn?: { (plugin: Plugin) }) {
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
     * Makes sure plugin method is triggered only once
     * @returns true if the plugin needs triggering
     */
    private pluginRequiresTriggering(cls: any, method: PluginMethodName) {
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