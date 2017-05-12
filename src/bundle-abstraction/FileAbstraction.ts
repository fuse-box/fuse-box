import { acornParse } from "../analysis/FileAnalysis";
import { PackageAbstraction } from "./PackageAbstraction";
import { ASTTraverse } from "../ASTTraverse";
import { RequireStatement } from "./nodes/RequireStatement";
import * as escodegen from "escodegen";

function isString(node: any): boolean {
    return node.type === "Literal" || node.type === "StringLiteral";
}
export class FileAbstraction {
    public ast: any;
    public requireStatements = new Set<RequireStatement​​>();
    public wrapperArguments: string[];
    private globalVariables = new Set<string>();
    constructor(public fuseBoxPath: string, public packageAbstraction: PackageAbstraction) {
        packageAbstraction.registerFileAbstraction(this);
    }

    /**
     * Initiates an abstraction from string
     */
    public loadString(contents: string) {
        this.ast = acornParse​​(contents);
        this.analyse();
    }

    /**
     * Initiates with AST
     */
    public loadAst(ast: any) {
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

    public generate() {
        let code = escodegen.generate(this.ast);
        if (this.wrapperArguments) {
            let fn = ["function(", this.wrapperArguments.join(","), '){\n'];
            fn.push(code, '\n}');
            code = fn.join("");
        }
        return code;
    }

    public analyse() {
        const globalNames = new Set<string>(["__filename", "__dirname", "exports", "module"]);
        //console.log(JSON.stringify(this.ast, null, 2));
        ASTTraverse.traverse(this.ast, {
            pre: (node, parent, prop, idx) => {
                // require statements
                if (node.callee && node.callee.type === "Identifier" && node.callee.name === "require") {
                    let arg1 = node.arguments[0];
                    if (arg1 && isString(arg1)) {
                        // adding a require statement
                        this.requireStatements.add(new RequireStatement(this, node))
                    }
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