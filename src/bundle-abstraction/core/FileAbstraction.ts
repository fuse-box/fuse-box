import { acornParse } from "../../analysis/FileAnalysis";
import { PackageAbstraction } from "./PackageAbstraction";
import { ASTTraverse } from "../../ASTTraverse";
import { RequireStatement } from "./nodes/RequireStatement";
import * as escodegen from "escodegen";
import * as path from "path";
import { ensureFuseBoxPath, transpileToEs5 } from "../../Utils";
import { FuseBoxIsServerCondition } from "./nodes/FuseBoxIsServerCondition";
import { FuseBoxIsBrowserCondition } from "./nodes/FuseBoxIsBrowserCondition";
import { matchesAssignmentExpression, matchesLiteralStringExpression, matchesSingleFunction, matchesDoubleMemberExpression, matcheObjectDefineProperty, matchesEcmaScript6 } from "./AstUtils";
import { ExportsInterop } from "./nodes/ExportsInterop";
import { UseStrict } from "./nodes/UseStrict";

const globalNames = new Set<string>(["__filename", "__dirname", "exports", "module"]);

export class FileAbstraction {
    private id: string;
    private fileMapRequested = false;
    public ast: any;
    public fuseBoxDir;

    public isEcmaScript6 = false;

    /** FILE CONTENTS */
    public requireStatements = new Set<RequireStatement​​>();
    public fuseboxIsServerConditions = new Set<FuseBoxIsServerCondition>();
    public fuseboxIsBrowserConditions = new Set<FuseBoxIsBrowserCondition>();
    public exportsInterop = new Set<ExportsInterop>();
    public useStrict = new Set<UseStrict>();

    public isEntryPoint = false;

    public wrapperArguments: string[];
    private globalVariables = new Set<string>();


    constructor(public fuseBoxPath: string, public packageAbstraction: PackageAbstraction) {
        this.fuseBoxDir = ensureFuseBoxPath(path.dirname(fuseBoxPath));
        this.setID(fuseBoxPath);
        packageAbstraction.registerFileAbstraction(this);
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

    public getID() {
        return this.id;
    }

    public addFileMap() {
        this.fileMapRequested = true;
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

    public setEnryPoint() {
        this.isEntryPoint = true;
    }


    public generate(ensureEs5: boolean = false) {
        let code = escodegen.generate(this.ast);

        if (ensureEs5 && this.isEcmaScript6) {
            code = transpileToEs5(code)
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
        if (this.fileMapRequested) {
            const pkg = JSON.stringify(this.packageAbstraction.name);
            const name = JSON.stringify(this.fuseBoxDir);
            fn.push("\n" + `$fsx.s[${JSON.stringify(this.getID())}] = [${pkg},${name} ]`);
        }
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
        // detecting es6
        if (matchesEcmaScript6(node)) {
            this.isEcmaScript6 = true;
        }
        // Object.defineProperty(exports, '__esModule', { value: true });
        if (matcheObjectDefineProperty(node, "exports")) {
            this.exportsInterop.add(new ExportsInterop(parent, prop, node));
        }
        if (matchesAssignmentExpression(node, 'exports', '__esModule')) {
            this.exportsInterop.add(new ExportsInterop(parent, prop, node));
        }
        if (matchesLiteralStringExpression(node, "use strict")) {
            this.useStrict.add(new UseStrict(parent, prop, node));
        }

        // require statements
        if (matchesSingleFunction(node, "require")) {
            // adding a require statement
            this.requireStatements.add(new RequireStatement(this, node));
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
            if (node.property.name === "isServer") {
                this.fuseboxIsServerConditions.add(new FuseBoxIsServerCondition(this, parent, prop, idx));
            }
            if (node.property.name === "isBrowser") {
                this.fuseboxIsBrowserConditions.add(new FuseBoxIsBrowserCondition(this, parent, prop, idx));
            }
            return false;
        }
        // global vars
        if (node && node.type === "Identifier") {
            let globalVariable;
            if (globalNames.has(node.name)) {
                globalVariable = node.name;
            }
            if (globalVariable) {
                if (!this.globalVariables.has(globalVariable)) {
                    this.globalVariables.add(globalVariable);
                }
            }
        }
    }


    public analyse() {

        //console.log(JSON.stringify(this.ast, null, 2));
        ASTTraverse.traverse(this.ast, {
            pre: (node, parent, prop, idx) => this.onNode(node, parent, prop, idx)
        });
    }
}