import { FileAbstraction } from "../FileAbstraction";

import * as path from "path";
import { joinFuseBoxPath } from "../../../Utils";
function isString(node: any): boolean {
    return node.type === "Literal" || node.type === "StringLiteral";
}

export class RequireStatement {
    public functionName: string;
    public value: string;
    public isNodeModule: boolean;
    public isComputed = false;
    public nodeModuleName: string;
    public nodeModulePartialRequire: string;
    public usedNames = new Set<string>();

    private resolvedAbstraction: FileAbstraction;
    private resolved = false;

    constructor(public file: FileAbstraction, public ast: any) {


        const arg1 = ast.arguments[0];
        this.functionName = ast.callee.name;
        const producer = file.packageAbstraction.bundleAbstraction.producerAbstraction;
        // if it's a string
        if (ast.arguments.length === 1 && isString(arg1)) {

            this.value = ast.arguments[0].value;
            let moduleValues = this.value.match(/^([a-z@](?!:).*)$/);

            this.isNodeModule = moduleValues !== null && moduleValues !== undefined;
            if (moduleValues) {
                const moduleValue = moduleValues[0];

                if (moduleValue.charAt(0) === '@') {
                    // matching @angular/animations/browser
                    // where package name is @angular/animations 
                    let matched = moduleValue.match(/(@[\w_-]+\/[\w_-]+)\/?(.*)/i);
                    if (matched) {
                        this.nodeModuleName = matched[1]
                        this.nodeModulePartialRequire = matched[2]
                    }
                } else {
                    const [moduleName, ...partialRequire] = moduleValue.split("/");
                    this.nodeModuleName = moduleName;
                    this.nodeModulePartialRequire = partialRequire.join("/");
                }
            }
        } else {
            // notify producer
            producer.useComputedRequireStatements = true;
            producer.useNumbers = false;
            // we assume it's a dynamic import
            this.isComputed = true;
        }


    }

    public setFunctionName(name: string) {
        this.ast.callee.name = name;
    }

    public bindID(id: any) {
        this.ast.callee.name += `.bind({id:${JSON.stringify(id)}})`
    }

    public setValue(str: string) {
        this.ast.arguments[0].value = str;
    }

    public resolve(): FileAbstraction {
        return this.resolveAbstraction();
    }



    private resolveAbstraction(): FileAbstraction {
        let resolved: FileAbstraction;
        if (!this.resolved) {
            this.resolved = true;
            // cannot resolve dynamic imports
            if (this.isComputed) {
                return;
            }
            const pkgName = !this.isNodeModule ? this.file.packageAbstraction.name : this.nodeModuleName;

            let resolvedName;
            const producerAbstraction = this.file.packageAbstraction.bundleAbstraction.producerAbstraction;
            if (!this.isNodeModule) {
                if (/^~\//.test(this.value)) {
                    resolvedName = this.value.slice(2)
                } else {
                    resolvedName = joinFuseBoxPath(path.dirname(this.file.fuseBoxPath), this.value);
                }
                resolved = producerAbstraction.findFileAbstraction(pkgName, resolvedName);
            } else {
                resolved = producerAbstraction.findFileAbstraction(pkgName, this.nodeModulePartialRequire);
            }
            if (resolved) {
                // register dependency
                this.file.addDependency(resolved, this);
            }
            this.resolvedAbstraction = resolved;
        }
        return this.resolvedAbstraction;
    }
}