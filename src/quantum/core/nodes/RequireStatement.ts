import { FileAbstraction } from "../FileAbstraction";

import * as path from "path";
import { joinFuseBoxPath } from "../../../Utils";
import { acornParse } from "../../../analysis/FileAnalysis";
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
    public identifiedStatementsAst: any;
    public identifier: string;
    public localReferences = 0;
    public isDynamicImport = false;

    

    private resolvedAbstraction: FileAbstraction;
    private resolved = false;

    constructor(public file: FileAbstraction, public ast: any, public parentAst?: any) {
        ast.arguments = ast.arguments || [];
        const arg1 = ast.arguments[0];
        this.functionName = ast.callee.name;
        const producer = file.packageAbstraction.bundleAbstraction.producerAbstraction;
        const customComputedStatementPaths = producer.opts.customComputedStatementPaths;
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
            this.isComputed = true;
            // limit it to require
            if (this.functionName === "require") {
                let showWarning = true;
                
                // notify producer
                customComputedStatementPaths.forEach((regexp, path) => {

                    if (regexp.test(file.getFuseBoxFullPath())) {
                        showWarning = false;
                    }
                });
                //if (!matched) {
                //producer.useComputedRequireStatements = true;
                //producer.useNumbers = false;
                //}
                // we assume it's a dynamic import
                if (showWarning) {
                    producer.addWarning(`Computed statement warning in ${this.file.packageAbstraction.name}/${this.file.fuseBoxPath}`);
                }
            }

        }
    }

    public removeWithIdentifier() {
        const declarator = this.parentAst;
        const declaration = declarator.$parent;
        const index = declaration.declarations.indexOf(declarator);
        declaration.declarations.splice(index, 1);
        if (declaration.declarations.length === 0) {
            const body = declaration.$parent;
            const prop = declaration.$prop;
            if (Array.isArray(body[prop]) && declaration.$idx !== undefined) {
                const arrayIndex = body[prop].indexOf(declaration);
                if (arrayIndex > -1) {
                    body[prop].splice(arrayIndex, 1);
                }
            }
        }
    }

    public setFunctionName(name: string) {
        this.ast.callee.name = name;
    }

    public bindID(id: any) {
        this.ast.callee.name += `.bind({id:${JSON.stringify(id)}})`
    }

    public isCSSRequested() {
        return this.value && path.extname(this.value) === ".css";
    }

    public isRemoteURL() {
        return this.value && /^http(s):/.test(this.value);
    }
    public isJSONRequested() {
        return this.value && path.extname(this.value) === ".json";
    }

    public setValue(str: string) {
        this.ast.arguments[0].value = str;
    }

    public setExpression(raw: string) {
        const astStatemet = acornParse​​(raw);
        if (astStatemet.body[0].expression) {
            this.ast.arguments = [astStatemet.body[0].expression];
        }
    }

    public getValue(): string {
        return this.ast.arguments[0].value;
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
        if( this.resolvedAbstraction){
            this.resolvedAbstraction.referencedRequireStatements.add(this);    
        }
        
        return this.resolvedAbstraction;
    }
}