import { ModuleCollection } from "./ModuleCollection";
import { FileAnalysis } from "../analysis/FileAnalysis";
import { WorkFlowContext, Plugin } from "./WorkflowContext";
import { IPathInformation, IPackageInformation } from "./PathMaster";
import { SourceMapGenerator } from "./SourceMapGenerator";
import { utils, each } from "realm-utils";
import * as fs from "fs";
import * as path from "path";

const appRoot = require("app-root-path");

/**
 *
 *
 * @export
 * @class File
 */
export class File {

    public isFuseBoxBundle = false;

    /**
     * In order to keep bundle in a bundle
     * We can't destory the original contents
     * But instead we add additional property that will override bundle file contents
     *
     * @type {string}
     * @memberOf FileAnalysis
     */
    public alternativeContent: string;

    public notFound: boolean;

    public params: Map<string, string>;
    /**
     *
     *
     * @type {string}
     * @memberOf File
     */
    public absPath: string;
    /**
     *
     *
     * @type {string}
     * @memberOf File
     */
    public contents: string;
    /**
     *
     *
     *
     * @memberOf File
     */
    public isLoaded = false;
    /**
     *
     *
     *
     * @memberOf File
     */
    public isNodeModuleEntry = false;
    /**
     *
     *
     * @type {ModuleCollection}
     * @memberOf File
     */
    public collection: ModuleCollection;
    /**
     *
     *
     * @type {string[]}
     * @memberOf File
     */
    public headerContent: string[];
    /**
     *
     *
     *
     * @memberOf File
     */
    public isTypeScript = false;
    /**
     *
     *
     * @type {*}
     * @memberOf File
     */
    public sourceMap: any;

    public properties = new Map<string, any>();
    /**
     *
     *
     * @type {FileAnalysis}
     * @memberOf File
     */
    public analysis: FileAnalysis = new FileAnalysis(this);
    /**
     *
     *
     * @type {Promise<any>[]}
     * @memberOf File
     */
    public resolving: Promise<any>[] = [];

    public subFiles: File[] = [];

    public groupMode = false;

    public groupHandler: Plugin;

    /**
     * Creates an instance of File.
     *
     * @param {WorkFlowContext} context
     * @param {IPathInformation} info
     *
     * @memberOf File
     */
    constructor(public context: WorkFlowContext, public info: IPathInformation) {
        if (info.params) {
            this.params = info.params;
        }
        this.absPath = info.absPath;
    }

    public static createByName(collection: ModuleCollection, name: string): File {
        let info = <IPathInformation>{
            fuseBoxPath: name,
            absPath: name,
        };
        let file = new File(collection.context, info);
        file.collection = collection;
        return file;
    }

    public static createModuleReference(collection: ModuleCollection, packageInfo: IPackageInformation): File {
        let info = <IPathInformation>{
            fuseBoxPath: name,
            absPath: name,
            isNodeModule: true,
            nodeModuleInfo: packageInfo,
        };
        let file = new File(collection.context, info);
        file.collection = collection;
        return file;
    }

    public addProperty(key: string, obj: any) {
        this.properties.set(key, obj);
    }

    public getProperty(key: string): any {
        return this.properties.get(key);
    }

    public hasSubFiles() {
        return this.subFiles.length > 0;
    }

    public addSubFile(file: File) {
        this.subFiles.push(file);
    }

    /**
     *
     *
     * @returns
     *
     * @memberOf File
     */
    public getCrossPlatormPath() {
        let name = this.absPath;
        if (!name) {
            return;
        }
        name = name.replace(/\\/g, "/");
        return name;
    }

    /**
     * Typescript transformation needs to be handled
     * Before the actual transformation
     * Can't exists within a chain group
     */
    public tryTypescriptPlugins() {
        if (this.context.plugins) {
            this.context.plugins.forEach((plugin: Plugin) => {
                if (utils.isFunction(plugin.onTypescriptTransform)) {
                    plugin.onTypescriptTransform(this);
                }
            });
        }
    }
    /**
     *
     *
     * @param {*} [_ast]
     *
     * @memberOf File
     */
    public tryPlugins(_ast?: any) {
        if (this.context.plugins) {
            const tasks = this.context.plugins.filter((plugin) => {
                return plugin.test && utils.isFunction(plugin.test.test) &&
                  plugin.transform && utils.isFunction(plugin.transform) &&
                  plugin.test.test(path.relative(appRoot.path, this.absPath));
            }).map((matchedPlugin) => {
                return () => matchedPlugin.transform(this);
            });

            // let target: Plugin;
            // let index = 0;
            // while (!target && index < this.context.plugins.length) {
            //     let item = this.context.plugins[index];
            //     let itemTest: RegExp;
            //     if (Array.isArray(item)) {
            //         let el = item[0];
            //         // for some reason on windows OS it gives false sometimes...
            //         // if (el instanceof RegExp) {
            //         //     itemTest = el;
            //         // }
            //         if (el && typeof el.test === "function") {
            //             itemTest = el;
            //         } else {
            //             itemTest = el.test;
            //         }
            //     } else {
            //         itemTest = item.test;
            //     }
            //     if (itemTest && utils.isFunction(itemTest.test) && itemTest.test(path.relative(appRoot.path, this.absPath))) {
            //         target = item;
            //     }
            //     index++;
            // }
            // const tasks = [];
            // if (target) {
            //
            //     if (Array.isArray(target)) {
            //         target.forEach(plugin => {
            //             if (utils.isFunction(plugin.transform)) {
            //                 this.context.debugPlugin(plugin, `Captured ${this.info.fuseBoxPath}`);
            //                 tasks.push(() => plugin.transform.apply(plugin, [this]));
            //             }
            //         });
            //     } else {
            //         if (utils.isFunction(target.transform)) {
            //             this.context.debugPlugin(target, `Captured ${this.info.fuseBoxPath}`);
            //             tasks.push(() => target.transform.apply(target, [this]));
            //         }
            //     }
            // }
            return this.context.queue(each(tasks, promise => promise()));
        }
    }
    /**
     *
     *
     * @param {string} str
     *
     * @memberOf File
     */
    public addHeaderContent(str: string) {
        if (!this.headerContent) {
            this.headerContent = [];
        }
        this.headerContent.push(str);
    }

    /**
     *
     *
     *
     * @memberOf File
     */
    public loadContents() {
        if (this.isLoaded) {
            return;
        }

        this.contents = fs.readFileSync(this.info.absPath).toString();
        this.isLoaded = true;
    }

    public makeAnalysis(parserOptions?: any) {
        if (!this.analysis.astIsLoaded()) {
            this.analysis.parseUsingAcorn(parserOptions);
        }
        this.analysis.analyze();
    }

    /**
     *
     *
     * @returns
     *
     * @memberOf File
     */
    public consume() {
        if (this.info.isRemoteFile) {
            return;
        }
        if (!this.absPath) {
            return;
        }
        if (!fs.existsSync(this.info.absPath)) {
            this.notFound = true;
            return;
        }

        if (/\.ts(x)?$/.test(this.absPath)) {
            this.context.debug("Typescript", `Captured  ${this.info.fuseBoxPath}`);
            return this.handleTypescript();
        }

        if (/\.js(x)?$/.test(this.absPath)) {
            this.loadContents();
            this.tryPlugins();
            const vendorSourceMaps = this.context.sourceMapConfig
                && this.context.sourceMapConfig.vendor === true && this.collection.name !== this.context.defaultPackageName;
            if (vendorSourceMaps) {
                this.loadVendorSourceMap();
            } else {
                this.makeAnalysis();
            }
            return;
        }
        this.tryPlugins();
        if (!this.isLoaded) {
            throw { message: `File contents for ${this.absPath} were not loaded. Missing a plugin?` };
        }
    }

    public loadVendorSourceMap() {
        const key = `vendor/${this.collection.name}/${this.info.fuseBoxPath}`;
        this.context.debug("File", `Vendor sourcemap ${key}`);
        let cachedMaps = this.context.cache.getPermanentCache(key);
        if (cachedMaps) {
            this.sourceMap = cachedMaps;
            this.makeAnalysis();
        } else {
            const tokens = [];
            this.makeAnalysis({ onToken: tokens });
            SourceMapGenerator.generate(this, tokens);
            this.generateCorrectSourceMap(key);

            this.context.cache.setPermanentCache(key, this.sourceMap);
        }

    }

    /**
     *
     *
     * @private
     * @returns
     *
     * @memberOf File
     */
    private handleTypescript() {
        const debug = (str: string) => this.context.debug("TypeScript", str);

        if (this.context.useCache) {
            let cached = this.context.cache.getStaticCache(this);
            if (cached) {
                this.isLoaded = true;
                this.sourceMap = cached.sourceMap;
                this.contents = cached.contents;

                if (cached.headerContent) {
                    this.headerContent = cached.headerContent;
                }
                debug(`From cache ${this.info.fuseBoxPath}`);

                this.analysis.dependencies = cached.dependencies;
                this.tryPlugins();
                return;
            }
        }
        const ts = require("typescript");

        this.loadContents();
        // Calling it before transpileModule on purpose
        this.tryTypescriptPlugins();
        debug(`Transpile ${this.info.fuseBoxPath}`);
        let result = ts.transpileModule(this.contents, this.getTranspilationConfig());

        if (result.sourceMapText && this.context.sourceMapConfig) {
            let jsonSourceMaps = JSON.parse(result.sourceMapText);
            jsonSourceMaps.file = this.info.fuseBoxPath;
            jsonSourceMaps.sources = [this.info.fuseBoxPath.replace(/\.js(x?)$/, ".ts$1")];
            result.outputText = result.outputText.replace("//# sourceMappingURL=module.js.map", "");
            this.sourceMap = JSON.stringify(jsonSourceMaps);
        }
        this.contents = result.outputText;

        // consuming transpiled javascript
        this.makeAnalysis();
        this.tryPlugins();

        if (this.context.useCache) {
            // emit new file
            this.context.emitJavascriptHotReload(this);
            this.context.cache.writeStaticCache(this, this.sourceMap);
        }
    }

    public generateCorrectSourceMap(fname?: string) {
        if (this.sourceMap) {
            let jsonSourceMaps = JSON.parse(this.sourceMap);
            jsonSourceMaps.file = this.info.fuseBoxPath;
            jsonSourceMaps.sources = [fname || this.info.fuseBoxPath];
            this.sourceMap = JSON.stringify(jsonSourceMaps);
        }
        return this.sourceMap;
    }

    /**
     * Provides a file-specific transpilation config. This is needed so we can supply the filename to
     * the TypeScript compiler.
     *
     * @private
     * @returns
     *
     * @memberOf File
     */
    private getTranspilationConfig() {
        return Object.assign({},
            this.context.getTypeScriptConfig(),
            {
                fileName: this.info.absPath,
            }
        );
    }
}
