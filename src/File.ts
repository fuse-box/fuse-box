import { ModuleCollection } from "./ModuleCollection";
import { FileAnalysis } from "./FileAnalysis";
import { WorkFlowContext, Plugin } from "./WorkflowContext";
import { IPathInformation } from "./PathMaster";
import * as fs from "fs";
import { utils, each } from "realm-utils";


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


    public asyncResolve(promise: Promise<any>) {
        this.resolving.push(promise);
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
                let item = this.context.plugins[index];
                let itemTest: RegExp;
                if (Array.isArray(item)) {
                    let el = item[0];
                    // check for the first item ( it might be a RegExp)
                    if (el instanceof RegExp) {
                        itemTest = el;
                    } else {
                        itemTest = el.test;
                    }
                } else {
                    itemTest = item.test;
                }
                if (itemTest && itemTest.test(this.absPath)) {
                    target = item;
                }
                index++;
            }

            if (target) {
                if (Array.isArray(target)) {
                    this.asyncResolve(each(target, (plugin: Plugin) => {
                        // if we are in a groupMode, we don't trigger tranform
                        // we trigger tranformGroup
                        if (this.groupMode && utils.isFunction(plugin.transformGroup)) {
                            return plugin.transformGroup.apply(plugin, [this]);
                        }
                        if (utils.isFunction(plugin.transform)) {
                            return plugin.transform.apply(plugin, [this]);
                        }
                    }));
                } else {
                    if (this.groupMode && utils.isFunction(target.transformGroup)) {
                        return this.asyncResolve(target.transformGroup.apply(target, [this]));
                    }
                    if (utils.isFunction(target.transform)) {
                        return this.asyncResolve(target.transform.apply(target, [this]));
                    }
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
            return this.handleTypescript();
        }

        if (/\.js(x)?$/.test(this.absPath)) {
            this.loadContents();
            this.tryPlugins();
            this.makeAnalysis();
            return;
        }
        this.tryPlugins();
        if (!this.isLoaded) {
            throw { message: `File contents for ${this.absPath} were not loaded. Missing a plugin?` }
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
        if (this.context.useCache) {
            let cached = this.context.cache.getStaticCache(this);
            if (cached) {
                this.isLoaded = true;
                this.sourceMap = cached.sourceMap;
                this.contents = cached.contents;
                if (cached.headerContent) {
                    this.headerContent = cached.headerContent;
                }
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
        this.tryPlugins();

        if (this.context.useCache) {
            // emit new file
            let cachedContent = this.contents;
            if (this.headerContent) {
                cachedContent = this.headerContent.join("\n") + "\n" + cachedContent;
            }

            this.context.emmitter.emit("source-changed", {
                type: "js",
                content: cachedContent,
                path: this.info.fuseBoxPath,
            });
            this.context.cache.writeStaticCache(this, this.sourceMap);
        }
    }
}
