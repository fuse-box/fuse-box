import * as path from "path";
import * as escodegen from "escodegen";
import { BundleSource } from "../BundleSource";
import { File } from "./File";
import { Log } from "../Log";
import { IPackageInformation, IPathInformation, AllowedExtenstions } from "./PathMaster";
import { ModuleCollection } from "./ModuleCollection";
import { ModuleCache } from "../ModuleCache";
import { EventEmitter } from "../EventEmitter";
import { utils } from "realm-utils";
import { ensureUserPath, findFileBackwards, ensureDir, removeFolder } from "../Utils";
import { SourceChangedEvent } from "../devServer/Server";
import { registerDefaultAutoImportModules, AutoImportedModule } from "./AutoImportedModule";
import { Defer } from "../Defer";
import { UserOutput } from "./UserOutput";
import { FuseBox } from "./FuseBox";
import { Bundle } from "./Bundle";
import { BundleProducer } from "./BundleProducer";

const appRoot = require("app-root-path");

/**
 * All the plugin method names
 */
export type PluginMethodName =
    "init"
    | "preBuild"
    | "preBundle"
    | "bundleStart"
    | "bundleEnd"
    | "postBundle"
    | "postBuild";

/**
 * Interface for a FuseBox plugin
 */
export interface Plugin {
    test?: RegExp;
    opts?: any;
    init?(context: WorkFlowContext): any;
    transform?(file: File, ast?: any): any;
    transformGroup?(file: File): any;
    onTypescriptTransform?(file: File): any;
    bundleStart?(context: WorkFlowContext): any;
    bundleEnd?(context: WorkFlowContext): any;
    producerEnd?(producer: BundleProducer): any;
    onSparky?(): any;
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
    /**
     * defaults to app-root-path, but can be set by user
     * @see FuseBox
     */
    public appRoot: any = appRoot.path;

    public shim: any;

    public fuse: FuseBox;

    public sourceChangedEmitter = new EventEmitter<SourceChangedEvent>();

    /**
     * The default package name or the package name configured in options
     */
    public defaultPackageName = "default";

    public transformTypescript?: (contents: string) => string;

    public ignoreGlobal: string[] = [];

    public pendingPromises: Promise<any>[] = [];

    public customAPIFile: string;

    public defaultEntryPoint: string;

    public rollupOptions: any;

    public output: UserOutput;

    public hash: string | Boolean;
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

    public sourceMapsProject: boolean = false;
    public sourceMapsVendor: boolean = false;
    public useSourceMaps = false;

    public initialLoad = true;

    public debugMode = false;

    public log: Log = new Log(this)

    public pluginTriggers: Map<string, Set<String>>;

    public natives = {
        process: true,
        stream: true,
        Buffer: true,
        http: true,
    }
    public autoImportConfig = {};

    public bundle: Bundle;

    public storage: Map<string, any>;

    public aliasCollection: any[];

    public experimentalAliasEnabled = false;

    public customCodeGenerator: any;

    public defer = new Defer;

    public initCache() {
        this.cache = new ModuleCache(this);
    }

    public resolve() {
        return Promise.all(this.pendingPromises).then(() => {
            this.pendingPromises = [];
        });
    }

    public queue(obj: any) {
        this.pendingPromises.push(obj);
    }

    public getHeaderImportsConfiguration() {

    }

    public setCodeGenerator(fn: any) {
        this.customCodeGenerator = fn;
    }

    public generateCode(ast: any) {
        if (this.customCodeGenerator) {
            return this.customCodeGenerator(ast);
        }
        return escodegen.generate(ast);
    }

    public emitJavascriptHotReload(file: File) {
        let content = file.contents;
        if (file.headerContent) {
            content = file.headerContent.join("\n") + "\n" + content;
        }

        this.sourceChangedEmitter.emit({
            type: "js",
            content,
            path: file.info.fuseBoxPath,
        });
    }

    public debug(group: string, text: string) {
        if (this.debugMode) {
            this.log.echo(`${group} : ${text}`);
        }
    }

    public nukeCache() {
        this.resetNodeModules();
        if (this.cache) {
            removeFolder(this.cache.cacheFolder);
            this.cache.initialize();
        }

    }

    public warning(str: string) {
        return this.log.echoWarning(str);
    }

    public fatal(str: string) {
        throw new Error(str);
    }
    public debugPlugin(plugin: Plugin, text: string) {
        const name = plugin.constructor && plugin.constructor.name ? plugin.constructor.name : "Unknown";
        this.debug(name, text);
    }

    public isShimed(name: string): boolean {
        if (!this.shim) {
            return false;
        }
        return this.shim[name] !== undefined;
    }

    public isHashingRequired() {
        const hashOption = this.hash;
        let useHash = false;
        if (typeof hashOption === "string") {
            if (hashOption !== "md5") {
                throw new Error(`Uknown algorythm ${hashOption}`)
            }
            useHash = true;
        }
        if (hashOption === true) {
            useHash = true;
        }
        return useHash;
    }

    /**
     * Resets significant class members
     */
    public reset() {
        this.log = new Log(this);
        this.storage = new Map();
        this.source = new BundleSource(this);
        this.nodeModules = new Map();
        this.pluginTriggers = new Map();
        this.fileGroups = new Map();
        this.libPaths = new Map();
    }

    public initAutoImportConfig(userNatives, userImports) {
        this.autoImportConfig = registerDefaultAutoImportModules(userNatives);
        if (utils.isPlainObject(userImports)) {
            for (let varName in userImports) {
                this.autoImportConfig[varName] = new AutoImportedModule(varName, userImports[varName]);
            }
        }
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
    public createFileGroup(name: string, collection: ModuleCollection, handler: Plugin): File {
        let info = <IPathInformation>{
            fuseBoxPath: name,
            absPath: name,
        };
        let file = new File(this, info);
        file.collection = collection;
        file.contents = "";
        file.groupMode = true;
        // Pass it along
        // Transformation might happen in a different plugin
        file.groupHandler = handler;

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

    public addAlias(obj: any, value?: any) {
        const aliases = [];
        if (!value) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (path.isAbsolute(key)) {
                        // dying in agony
                        this.fatal(`Can't use absolute paths with alias "${key}"`);
                    }

                    aliases.push({ expr: new RegExp(`^(${key})(/|$)`), replacement: obj[key] });
                }
            }
        } else {
            aliases.push({ expr: new RegExp(`^(${obj})(/|$)`), replacement: value });
        }


        this.aliasCollection = this.aliasCollection || [];
        this.aliasCollection = this.aliasCollection.concat(aliases)
        this.experimentalAliasEnabled = true;
    }
    public setHomeDir(dir: string) {
        this.homeDir = ensureDir(dir);
    }

    public setLibInfo(name: string, version: string, info: IPackageInformation) {
        let key = `${name}@${version}`;
        if (!this.libPaths.has(key)) {
            return this.libPaths.set(key, info);
        }
    }

    /** Converts the file extension from `.ts` to `.js` */
    public convert2typescript(name: string) {
        return name.replace(/\.ts$/, ".js");
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

    public resetNodeModules() {
        this.nodeModules = new Map<string, ModuleCollection>();
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
            compilerOptions: {},
        };;
        if (this.tsConfig) {
            configFile = ensureUserPath(this.tsConfig);
        } else {
            url = path.join(this.homeDir, "tsconfig.json");
            let tsconfig = findFileBackwards(url, this.appRoot);
            if (tsconfig) {
                configFile = tsconfig;
            }
        }

        if (configFile) {
            this.log.echoStatus(`Typescript config:  ${configFile.replace(this.appRoot, "")}`);
            config = require(configFile);
        } else {
            this.log.echoStatus(`Typescript config file was not found. Improvising`);
        }

        config.compilerOptions.module = "commonjs";

        if (this.useSourceMaps) {
            config.compilerOptions.sourceMap = true;
            config.compilerOptions.inlineSources = true;
        }
        // switch to target es6
        if (this.rollupOptions) {
            this.debug("Typescript", "Forcing es6 output for typescript. Rollup deteced");
            config.compilerOptions.module = "es6";
            config.compilerOptions.target = "es6";
        }
        this.loadedTsConfig = config;
        return config;
    }

    public isFirstTime() {
        return this.initialLoad === true;
    }



    public writeOutput(outFileWritten?: () => any) {
        this.initialLoad = false;

        const res = this.source.getResult();
        if (this.output) {
            this.output.writeCurrent(res.content).then(() => {
                this.writeSourceMaps(res);
                this.defer.unlock();
                if (utils.isFunction(outFileWritten)) {
                    outFileWritten();
                }
            });
        }


    }

    protected writeSourceMaps(result: any) {
        // Writing sourcemaps
        if (this.sourceMapsProject || this.sourceMapsVendor) {
            this.output.write(`${this.bundle.name}.js.map`, result.sourceMap);
        }
    }
    public shouldSplit(file: File): boolean {
        if (this.bundle && this.bundle.bundleSplit) {
            return this.bundle.bundleSplit.verify(file);
        }
        return false;
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
