import { WorkFlowContext, Plugin } from "./WorkflowContext";
import { IPathInformation } from "./PathMaster";
import * as fs from "fs";
import * as path from "path";

const esquery = require("esquery");
import { utils } from "realm-utils";
const acorn = require("acorn");
require("acorn-es7")(acorn);
export function extractRequires(contents: string, absPath: string) {
    let ast = acorn.parse(contents, {
        sourceType: "module",
        tolerant: true,
        ecmaVersion: 7,
        plugins: { es7: true },
    });
    let matches = esquery(ast, "CallExpression[callee.name=\"require\"],ImportDeclaration[source.type=\"Literal\"]");
    let results = [];
    matches.map(item => {
        if (item.arguments) {
            if (item.arguments[0]) {
                let name = item.arguments[0].value;
                if (!name) {
                    return;
                }
                results.push(name);
            }
        }
        if (item.source) {
            results.push(item.source.value);
        }
    });
    return {
        requires: results,
        ast: ast
    };
}

export class File {
    public absPath: string;
    public contents: string;
    public isLoaded = false;
    public isNodeModuleEntry = false;
    public resolving: Promise<any>[] = [];
    constructor(public context: WorkFlowContext, public info: IPathInformation) {
        this.absPath = info.absPath;
    }

    public getCrossPlatormPath() {
        let name = this.absPath;
        name = name.replace(/\\/g, "/");
        return name;
    }

    public tryPlugins(_ast?: any) {

        if (this.context.plugins) {
            let target: Plugin;
            let index = 0;
            while (!target && index < this.context.plugins.length) {
                let plugin = this.context.plugins[index];
                if (plugin.test.test(this.absPath)) {
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


    public consume(): string[] {
        if (!this.absPath) {
            return [];
        }
        if (!fs.existsSync(this.info.absPath)) {
            this.contents = "";
            return [];
        }
        this.contents = fs.readFileSync(this.info.absPath).toString();
        this.isLoaded = true;

        if (this.absPath.match(/\.js$/)) {
            let data = extractRequires(this.contents, path.join(this.absPath));

            this.tryPlugins(data.ast);
            return data.requires;
        }
        this.tryPlugins();
        return [];
    }
}