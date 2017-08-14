import { acornParse } from "../../analysis/FileAnalysis";
import { PackageAbstraction } from "./PackageAbstraction";
import { ASTTraverse } from "../../ASTTraverse";
import { RequireStatement } from "./nodes/RequireStatement";
import * as escodegen from "escodegen";
import * as path from "path";
import { ensureFuseBoxPath, transpileToEs5 } from "../../Utils";

import {
    matchesAssignmentExpression, matchesLiteralStringExpression, matchesSingleFunction, matchesDoubleMemberExpression, matcheObjectDefineProperty, matchesEcmaScript6, matchesTypeOf, matchRequireIdentifier,
    trackRequireMember, matchNamedExport,
    isExportMisused, matchesNodeEnv, matchesExportReference,
    matchesIfStatementProcessEnv, compareStatement, matchesIfStatementFuseBoxIsEnvironment, isExportComputed
} from "./AstUtils";
import { ExportsInterop } from "./nodes/ExportsInterop";
import { UseStrict } from "./nodes/UseStrict";
import { TypeOfExportsKeyword } from "./nodes/TypeOfExportsKeyword";
import { TypeOfModuleKeyword } from "./nodes/TypeOfModuleKeyword";
import { TypeOfWindowKeyword } from "./nodes/TypeOfWindowKeyword";
import { NamedExport } from "./nodes/NamedExport";
import { GenericAst } from "./nodes/GenericAst";
import { QuantumItem } from "../plugin/QuantumSplit";
import { QuantumCore } from "../plugin/QuantumCore";
import { ReplaceableBlock } from "./nodes/ReplaceableBlock";

const globalNames = new Set<string>(["__filename", "__dirname", "exports", "module"]);

const SystemVars = new Set<string>(["module", "exports", "require", "window", "global"]);

export class FileAbstraction {
    private id: string;
    private fileMapRequested = false;
    private treeShakingRestricted = false;
    public dependents = new Set<FileAbstraction>();
    private dependencies = new Map<FileAbstraction, Set<RequireStatement​​>>();
    public ast: any;
    public fuseBoxDir;

    public isEcmaScript6 = false;
    public shakable = false;
    public globalsName: string;
    public amountOfReferences = 0;
    public canBeRemoved = false;
    public quantumItem: QuantumItem;

    public namedRequireStatements = new Map<string, RequireStatement​​>();

    /** FILE CONTENTS */
    public requireStatements = new Set<RequireStatement​​>();
    public dynamicImportStatements = new Set<RequireStatement​​>();
    public fuseboxIsEnvConditions = new Set<ReplaceableBlock>();

    public definedLocally = new Set<string>();

    public exportsInterop = new Set<ExportsInterop>();
    public useStrict = new Set<UseStrict>();
    public typeofExportsKeywords = new Set<TypeOfExportsKeyword>();
    public typeofModulesKeywords = new Set<TypeOfModuleKeyword>();
    public typeofWindowKeywords = new Set<TypeOfWindowKeyword>();
    public typeofGlobalKeywords = new Set<GenericAst>();
    public typeofDefineKeywords = new Set<GenericAst>();
    public typeofRequireKeywords = new Set<GenericAst>();

    public namedExports = new Map<string, NamedExport>();
    public processNodeEnv = new Set<ReplaceableBlock>();
    public core: QuantumCore;

    public isEntryPoint = false;

    public wrapperArguments: string[];
    public localExportUsageAmount = new Map<string, number>();
    private globalVariables = new Set<string>();


    constructor(public fuseBoxPath: string, public packageAbstraction: PackageAbstraction) {
        this.fuseBoxDir = ensureFuseBoxPath(path.dirname(fuseBoxPath));
        this.setID(fuseBoxPath);
        packageAbstraction.registerFileAbstraction(this);
        this.core = this.packageAbstraction.bundleAbstraction.producerAbstraction.quantumCore;

        // removing process polyfill if not required
        // techincally this is not necessary when tree shaking is enable. Because of:
        // StatementModification.ts lines:
        // if (resolvedFile.isProcessPolyfill() && !core.opts.shouldBundleProcessPolyfill()) {
        //   return statement.removeWithIdentifier();
        // }
        // Which doesn't add the references
        if (this.core && !this.core.opts.shouldBundleProcessPolyfill() && this.isProcessPolyfill()) {
            this.markForRemoval();
        }
    }

    public isProcessPolyfill() {
        return this.getFuseBoxFullPath() === "process/index.js";
    }

    public registerHoistedIdentifiers(identifier: string, statement: RequireStatement, resolvedFile: FileAbstraction) {
        const bundle = this.packageAbstraction.bundleAbstraction;
        bundle.registerHoistedIdentifiers(identifier, statement, resolvedFile);
    }

    public getFuseBoxFullPath() {
        return `${this.packageAbstraction.name}/${this.fuseBoxPath}`;
    }


    public isNotUsedAnywhere() {
        return this.getID().toString() !== "0"
            && this.dependents.size === 0 && !this.quantumItem && !this.isEntryPoint;
    }

    public releaseDependent(file: FileAbstraction) {
        this.dependents.delete(file);
    }
    public markForRemoval() {
        this.canBeRemoved = true;
    }
    /**
     * Initiates an abstraction from string
     */
    public loadString(contents: string) {
        this.ast = acornParse​​(contents);
        this.analyse();
    }
    public setID(id: any) {
        this.id = id;
    }

    public referenceQuantumSplit(item: QuantumItem) {
        item.addFile(this);
        this.quantumItem = item;
    }

    public getSplitReference(): QuantumItem {
        return this.quantumItem;
    }

    public getID() {
        return this.id;
    }

    public addFileMap() {
        this.fileMapRequested = true;
    }
    public isTreeShakingAllowed() {

        return this.treeShakingRestricted === false && this.shakable;
    }

    public restrictTreeShaking() {
        this.treeShakingRestricted = true;
    }

    public addDependency(file: FileAbstraction, statement: RequireStatement) {
        let list: Set<RequireStatement>;
        if (this.dependencies.has(file)) {
            list = this.dependencies.get(file);
        } else {
            list = new Set<RequireStatement>()
            this.dependencies.set(file, list);
        }
        list.add(statement)
    }

    public getDependencies() {
        return this.dependencies;
    }
    /**
     * Initiates with AST
     */
    public loadAst(ast: any) {
        // fix the initial node
        ast.type = "Program"
        this.ast = ast;
        this.analyse();
    }

    /**
     * Finds require statements with given mask
     */
    public findRequireStatements(exp: RegExp): RequireStatement[] {
        let list: RequireStatement[] = [];
        this.requireStatements.forEach(statement => {
            if (exp.test(statement.value)) {
                list.push(statement);
            }
        })
        return list;
    }

    public wrapWithFunction(args: string[]) {
        this.wrapperArguments = args;
    }


    /**
     * Return true if there is even a single require statement
     */
    public isRequireStatementUsed() {
        return this.requireStatements.size > 0;
    }

    public isDirnameUsed() {
        return this.globalVariables.has("__dirname");
    }

    public isFilenameUsed() {
        return this.globalVariables.has("__filename");
    }


    public isExportStatementInUse() {
        return this.globalVariables.has("exports");
    }

    public isModuleStatementInUse() {
        return this.globalVariables.has("module");
    }
    public isExportInUse() {
        return this.globalVariables.has("exports") || this.globalVariables.has("module");
    }

    public setEnryPoint(globalsName?: string) {
        this.isEntryPoint = true;
        this.globalsName = globalsName;
        this.treeShakingRestricted = true;
    }


    public generate(ensureEs5: boolean = false) {
        let code = escodegen.generate(this.ast);
        if (ensureEs5 && this.isEcmaScript6) {
            code = transpileToEs5(code);
        }

        //if (this.wrapperArguments) {
        let fn = ["function(", this.wrapperArguments ? this.wrapperArguments.join(",") : "", '){\n'];
        // inject __dirname
        if (this.isDirnameUsed()) {
            fn.push(`var __dirname = ${JSON.stringify(this.fuseBoxDir)};` + "\n");
        }
        if (this.isFilenameUsed()) {
            fn.push(`var __filename = ${JSON.stringify(this.fuseBoxPath)};` + "\n");
        }
        fn.push(code, '\n}');
        code = fn.join("");
        return code;
    }

    /**
     *
     * @param node
     * @param parent
     * @param prop
     * @param idx
     */
    private onNode(node, parent, prop, idx) {

        // process.env
        if (this.core) {
            const processKeyInIfStatement = matchesIfStatementProcessEnv(node);
            const value = this.core.producer.userEnvVariables[processKeyInIfStatement];
            if (processKeyInIfStatement) {
                const result = compareStatement(node, value);
                const processNode = new ReplaceableBlock(node.test, "left", node.test.left);
                this.processNodeEnv.add(processNode);
                return processNode.conditionalAnalysis(node, result);
            } else {
                const inlineProcessKey = matchesNodeEnv(node);
                if (inlineProcessKey) {
                    const value = this.core.producer.userEnvVariables[inlineProcessKey];
                    const env = new ReplaceableBlock(parent, prop, node);
                    value === undefined ? env.setUndefinedValue() : env.setValue(value);
                    this.processNodeEnv.add(env);
                }
            }

            const isEnvName = matchesIfStatementFuseBoxIsEnvironment(node);
            if (isEnvName) {
                let value;
                if (isEnvName === "isServer") {
                    value = this.core.opts.isTargetServer();
                }
                if (isEnvName === "isBrowser") {
                    value = this.core.opts.isTargetBrowser();
                }

                if (isEnvName === "target") {
                    value = this.core.opts.getTarget();
                }
                if (!this.core.opts.isTargetUniveral()) {
                    const isEnvNode = new ReplaceableBlock(node, "", node.test);
                    isEnvNode.identifier = isEnvName;
                    this.fuseboxIsEnvConditions.add(isEnvNode);
                    return isEnvNode.conditionalAnalysis(node, value);
                }
            }
            if (matchesDoubleMemberExpression(node, "FuseBox")) {
                let envName = node.property.name;
                if (envName === "isServer" || envName === "isBrowser" || envName === "target") {
                    let value;
                    if (envName === "isServer") {
                        value = this.core.opts.isTargetServer();
                    }
                    if (envName === "isBrowser") {
                        value = this.core.opts.isTargetBrowser();
                    }
                    if (envName === "target") {
                        value = this.core.opts.getTarget();
                    }
                    const envNode = new ReplaceableBlock(parent, prop, node);
                    envNode.identifier = envName;
                    envNode.setValue(value);
                    this.fuseboxIsEnvConditions.add(envNode);
                }
            }
        }


        // detecting es6
        if (matchesEcmaScript6(node)) {
            this.isEcmaScript6 = true;
        }
        this.namedRequireStatements.forEach((statement, key) => {
            const importedName = trackRequireMember(node, key);
            if (importedName) {
                statement.usedNames.add(importedName);
            }
        });
        // restrict tree shaking if there is even a hint on computed properties
        isExportComputed(node, (isComputed) => {
            if (isComputed) {
                this.restrictTreeShaking();
            }
        })
        // trying to match a case where an export is misused
        // for example exports.foo.bar.prototype
        // we can't tree shake this exports
        isExportMisused(node, name => {
            const createdExports = this.namedExports.get(name);
            if (createdExports) {
                createdExports.eligibleForTreeShaking = false;
            }
        });
        /**
         * Matching how many times an export has been used within one file
         * For example
         * exports.createAction = () => {
         *   return exports.createSomething();
         * }
         * exports.createSomething = () => {}
         * The example above creates a conflicting situation if createSomething wasn't used externally
         */
        const matchesExportIdentifier = matchesExportReference(node);
        if (matchesExportIdentifier) {
            let ref = this.localExportUsageAmount.get(matchesExportIdentifier)
            if (ref === undefined) {
                this.localExportUsageAmount.set(matchesExportIdentifier, 1)
            } else {
                this.localExportUsageAmount.set(matchesExportIdentifier, ++ref)
            }
        }
        matchNamedExport(node, (name) => {
            // const namedExport = new NamedExport(parent, prop, node);
            // namedExport.name = name;
            // this.namedExports.set(name, namedExport);

            let namedExport: NamedExport;
            //namedExport.name = name;
            if (!this.namedExports.get(name)) {
                namedExport = new NamedExport();
                namedExport.name = name;
                this.namedExports.set(name, namedExport)
            } else {
                namedExport = this.namedExports.get(name);
            }

            namedExport.addNode(parent, prop, node);
        });
        // require statements
        if (matchesSingleFunction(node, "require")) {
            // adding a require statement
            this.requireStatements.add(new RequireStatement(this, node));
        }
        // Fusebox converts new imports to $fsmp$
        if (matchesSingleFunction(node, "$fsmp$")) {
            // adding a require statement
            this.dynamicImportStatements.add(new RequireStatement(this, node));
        }

        // typeof module
        if (matchesTypeOf(node, "module")) {
            this.typeofModulesKeywords.add(new TypeOfModuleKeyword(parent, prop, node));
        }

        if (matchesTypeOf(node, "require")) {
            this.typeofRequireKeywords.add(new GenericAst(parent, prop, node));
        }



        // Object.defineProperty(exports, '__esModule', { value: true });
        if (matcheObjectDefineProperty(node, "exports")) {
            if (!this.globalVariables.has("exports")) {
                this.globalVariables.add("exports");
            }
            this.exportsInterop.add(new ExportsInterop(parent, prop, node));
        }
        if (matchesAssignmentExpression(node, 'exports', '__esModule')) {
            if (!this.globalVariables.has("exports")) {
                this.globalVariables.add("exports");
            }
            this.exportsInterop.add(new ExportsInterop(parent, prop, node));
        }

        if (matchesTypeOf(node, "exports")) {
            this.typeofExportsKeywords.add(new TypeOfExportsKeyword(parent, prop, node));
        }
        if (matchesLiteralStringExpression(node, "use strict")) {
            this.useStrict.add(new UseStrict(parent, prop, node));
        }

        if (matchesTypeOf(node, "global")) {
            this.typeofGlobalKeywords.add(new GenericAst(parent, prop, node))
        }
        if (matchesTypeOf(node, "define")) {
            this.typeofDefineKeywords.add(new GenericAst(parent, prop, node))
        }

        // typeof window
        if (matchesTypeOf(node, "window")) {
            this.typeofWindowKeywords.add(new GenericAst(parent, prop, node))
        }

        /**
         * Matching 
         * var name = require('module')
         * Gethering identifiers name to do:
         * 1) Hoisting
         * 2) Detect which variables are used in exports to do tree shaking later on
         */
        const requireIdentifier = matchRequireIdentifier(node);
        if (requireIdentifier) {
            const identifiedRequireStatement = new RequireStatement(this, node.init, node);
            identifiedRequireStatement.identifier = requireIdentifier;
            this.namedRequireStatements.set(requireIdentifier, identifiedRequireStatement);
            this.requireStatements.add(identifiedRequireStatement);
            return false;
        }



        // FuseBox features
        if (matchesDoubleMemberExpression(node, "FuseBox")) {

            if (node.property.name === "import") {
                // replace it right away with require statement
                parent.callee = {
                    type: "Identifier",
                    name: "require"
                }
                // treat it like any any other require statements
                this.requireStatements.add(new RequireStatement(this, parent));
            }

            return false;
        }
        // global vars
        if (node && node.type === "Identifier") {
            let globalVariable;
            if (globalNames.has(node.name)) {
                globalVariable = node.name;
            }
            if (node.name === "global") {
                this.packageAbstraction.bundleAbstraction.globalVariableRequired = true;
            }
            this.detectLocallyDefinedSystemVariables(node);

            if (globalVariable) {
                if (!this.globalVariables.has(globalVariable)) {
                    this.globalVariables.add(globalVariable);
                }
            }
        }
    }

    private detectLocallyDefinedSystemVariables(node: any) {
        let definedName;
        // detecting if the Indentifer is in SystemVars (module, exports, require e.tc)
        if (SystemVars.has(node.name)) {
            // if it's define within a local function
            if (node.$prop === "params") {
                if (node.$parent && node.$parent.type === "FunctionDeclaration") {
                    definedName = node.name;
                }
            }
            // if it's a variable declaration
            // var module = 1;
            if (node.$prop === "id") {
                if (node.$parent && node.$parent.type == "VariableDeclarator") {
                    definedName = node.name;
                }
            }
        }

        if (definedName) {
            if (!this.definedLocally.has(definedName)) {
                this.definedLocally.add(definedName);
            }
        }
    }


    public analyse() {
        // console.log(JSON.stringify(this.ast, null, 2));
        ASTTraverse.traverse(this.ast, {
            pre: (node, parent, prop, idx) => this.onNode(node, parent, prop, idx)
        });
    }
}
