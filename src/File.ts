import { PluginChain } from './PluginChain';
import { ModuleCollection } from "./ModuleCollection";
import { FileAnalysis } from "./FileAnalysis";
import { WorkFlowContext, Plugin } from "./WorkflowContext";
import { IPathInformation } from "./PathMaster";
import * as fs from "fs";
import { utils } from "realm-utils";


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
    /**
     * Creates an instance of File.
     * 
     * @param {WorkFlowContext} context
     * @param {IPathInformation} info
     * 
     * @memberOf File
     */
    constructor(public context: WorkFlowContext, public info: IPathInformation) {
        this.absPath = info.absPath;
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

    public createChain(name: string, file: File, opts?: any) {
        return new PluginChain(name, file, opts);
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
            let target: Plugin;
            let index = 0;
            while (!target && index < this.context.plugins.length) {
                let plugin = this.context.plugins[index];
                if (plugin.test && plugin.test.test(this.absPath)) {
                    target = plugin;
                }
                index++;
            }
            let tranformationResult;
            // Found target plugin
            if (target) {
                // call tranformation callback
                if (utils.isFunction(target.transform)) {
                    tranformationResult = target.transform.apply(target, [this, _ast]);

                }
            }

            if (utils.isPromise(tranformationResult)) {

                // Let tranformation resolve (if it's async)
                this.resolving.push(new Promise((resolve, reject) => {

                    tranformationResult.then(res => {
                        console.log("all good");
                        if (res instanceof PluginChain) {
                            this.chainPlugins(index, res);
                        }
                        return resolve(res);
                    }).catch(reject);
                }));
            } else {
                if (tranformationResult instanceof PluginChain) {
                    this.chainPlugins(index, tranformationResult);
                }
            }
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
        this.contents = fs.readFileSync(this.info.absPath).toString();
        this.isLoaded = true;
    }

    public makeAnalysis() {
        if (!this.analysis.astIsLoaded()) {
            this.analysis.parseUsingAcorn();
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
            return this.handleTypescript();
        }

        if (/\.js(x)?$/.test(this.absPath)) {
            this.loadContents();
            this.tryPlugins();
            this.makeAnalysis();
            return;
        }
        this.tryPlugins();
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
        if (this.context.useCache) {
            let cached = this.context.cache.getStaticCache(this);
            if (cached) {
                this.isLoaded = true;
                this.sourceMap = cached.sourceMap;
                this.contents = cached.contents;
                this.analysis.dependencies = cached.dependencies;
                this.tryPlugins();
                return;
            }
        }
        const ts = require("typescript");

        this.loadContents();
        let result = ts.transpileModule(this.contents, this.context.getTypeScriptConfig());

        if (result.sourceMapText && this.context.sourceMapConfig) {
            let jsonSourceMaps = JSON.parse(result.sourceMapText);
            jsonSourceMaps.file = this.info.fuseBoxPath;
            jsonSourceMaps.sources = [this.info.fuseBoxPath.replace(/\.js$/, ".ts")];
            result.outputText = result.outputText.replace("//# sourceMappingURL=module.js.map", "")
            this.sourceMap = JSON.stringify(jsonSourceMaps);
        }
        this.contents = result.outputText;

        // consuming transpiled javascript
        this.makeAnalysis();
        if (this.context.useCache) {
            this.context.cache.writeStaticCache(this, this.sourceMap);
        }
        this.tryPlugins();
    }

    private chainPlugins(start: number, chain: PluginChain) {
        chain.setContent(this.context);
        let total = this.context.plugins.length;
        for (let i = start; i < total; i++) {
            let plugin = this.context.plugins[i];
            if (utils.isFunction(plugin[chain.methodName])) {
                plugin[chain.methodName](chain);
            }
        }
    }
}