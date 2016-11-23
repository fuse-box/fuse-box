import { FileAST } from './FileAST';
import { WorkFlowContext, Plugin } from "./WorkflowContext";
import { IPathInformation } from "./PathMaster";
import * as fs from "fs";
import * as path from "path";
import { utils } from "realm-utils";



export class File {
    public absPath: string;
    public contents: string;
    public isLoaded = false;
    public isNodeModuleEntry = false;
    public headerContent: string[];
    public isTypeScript = false;
    public sourceMap: any;
    public resolving: Promise<any>[] = [];
    constructor(public context: WorkFlowContext, public info: IPathInformation) {

        this.absPath = info.absPath;
    }

    public getCrossPlatormPath() {
        let name = this.absPath;
        if (!name) {
            return
        }
        name = name.replace(/\\/g, "/");
        return name;
    }

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
            // Found target plugin
            if (target) {
                // call tranformation callback
                if (utils.isFunction(target.transform)) {
                    let response = target.transform.apply(target, [this, _ast]);
                    // Tranformation can be async
                    if (utils.isPromise(response)) {
                        this.resolving.push(response);
                    }
                }
            }
        }
    }
    public addHeaderContent(str: string) {
        if (!this.headerContent) {
            this.headerContent = [];
        }
        this.headerContent.push(str);
    }


    public consume(): string[] {
        if (this.info.isRemoteFile) {
            return [];
        }
        if (!this.absPath) {
            return [];
        }
        if (!fs.existsSync(this.info.absPath)) {
            this.contents = "";
            return [];
        }
        this.contents = fs.readFileSync(this.info.absPath).toString();
        this.isLoaded = true;

        if (this.absPath.match(/\.ts$/)) {
            return this.handleTypescript();
        }

        if (this.absPath.match(/\.js$/)) {
            let fileAst = new FileAST(this);
            fileAst.consume();
            this.tryPlugins(fileAst.ast);
            return fileAst.dependencies;
        }
        this.tryPlugins();
        return [];
    }

    private handleTypescript() {
        if (this.context.useCache) {
            let cached = this.context.cache.getStaticCache(this);
            if (cached) {
                this.sourceMap = cached.sourceMap;
                this.contents = cached.contents;
                this.tryPlugins();
                return cached.dependencies;
            }
        }
        const ts = require("typescript");
        let result = ts.transpileModule(this.contents, this.context.getTypeScriptConfig());

        if (result.sourceMapText && this.context.sourceMapConfig) {
            let jsonSourceMaps = JSON.parse(result.sourceMapText);
            jsonSourceMaps.file = this.info.fuseBoxPath;
            jsonSourceMaps.sources = [this.info.fuseBoxPath.replace(/\.js$/, ".ts")];
            this.sourceMap = JSON.stringify(jsonSourceMaps);
        }

        this.contents = result.outputText;
        // consuming transpiled javascript
        let fileAst = new FileAST(this);
        fileAst.consume();
        if (this.context.useCache) {
            this.context.cache.writeStaticCache(this, fileAst.dependencies, this.sourceMap);
        }
        this.tryPlugins(fileAst.ast);
        return fileAst.dependencies;
    }
}