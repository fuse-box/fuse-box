import { acornParse } from "../analysis/FileAnalysis";
import { PackageAbstraction } from "./PackageAbstraction";
import { ASTTraverse } from "../ASTTraverse";
import { RequireStatement } from "./nodes/RequireStatement";
import * as escodegen from "escodegen";
import * as path from "path";
import { ensureFuseBoxPath } from "../Utils";


export class FileAbstraction {
    private id: string;
    private fileMapRequested = false;
    public ast: any;
    public fuseBoxDir;

    public requireStatements = new Set<RequireStatement​​>();
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

    public isExportInUse() {
        return this.globalVariables.has("exports") || this.globalVariables.has("module");
    }

    public setEnryPoint() {
        this.isEntryPoint = true;
    }


    public generate() {
        let code = escodegen.generate(this.ast);
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

    public analyse() {
        const globalNames = new Set<string>(["__filename", "__dirname", "exports", "module"]);
        //console.log(JSON.stringify(this.ast, null, 2));
        ASTTraverse.traverse(this.ast, {
            pre: (node, parent, prop, idx) => {
                // require statements
                if (node.callee && node.callee.type === "Identifier" && node.callee.name === "require") {
                    // adding a require statement
                    this.requireStatements.add(new RequireStatement(this, node));
                }

                // FuseBox features
                if (node.type === "MemberExpression"
                    && node.object
                    && node.object.type === "Identifier"
                    && node.object.name === "FuseBox" && node.property) {

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
                    if (globalVariable) {
                        if (!this.globalVariables.has(globalVariable)) {
                            this.globalVariables.add(globalVariable);
                        }
                    }
                }
            },
        });
    }
}