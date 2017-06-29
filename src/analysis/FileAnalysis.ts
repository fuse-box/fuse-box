import { ASTTraverse } from "./../ASTTraverse";
import { PrettyError } from "./../PrettyError";
import { File } from "../core/File";
import * as acorn from "acorn";
import { AutoImport } from "./plugins/AutoImport";
import { OwnVariable } from "./plugins/OwnVariable";
import { OwnBundle } from "./plugins/OwnBundle";
import { ImportDeclaration } from "./plugins/ImportDeclaration";
import { DynamicImportStatement } from "./plugins/DynamicImportStatement";

require("acorn-es7")(acorn);
require("acorn-jsx/inject")(acorn);

const plugins: any = [AutoImport, OwnVariable, OwnBundle, ImportDeclaration, DynamicImportStatement];

export function acornParse(contents, options?: any) {
    return acorn.parse(contents, {
        ...options || {}, ...{
            sourceType: "module",
            tolerant: true,
            ecmaVersion: 8,
            plugins: { es7: true, jsx: true },
            jsx: { allowNamespacedObjects: true },
        },
    });
}
/**
 * Makes static analysis on the code
 * Gets require statements (es5 and es6)
 *
 * Adds additional injections (if needed)
 *
 * @export
 * @class FileAST
 */
export class FileAnalysis {

    public ast: any;

    private wasAnalysed = false;

    private skipAnalysis = false;

    public bannedImports = {};

    public nativeImports = {};

    public fuseBoxMainFile;

    public requiresRegeneration = false;

    public fuseBoxVariable = "FuseBox";

    public dependencies: string[] = [];

    constructor(public file: File) { }

    public astIsLoaded(): boolean {
        return this.ast !== undefined;
    }

    /**
     * Loads an AST
     *
     * @param {*} ast
     *
     * @memberOf FileAnalysis
     */
    public loadAst(ast: any) {
        this.ast = ast;
    }

    public skip() {
        this.skipAnalysis = true;
    }

    /**
     *
     *
     * @private
     *
     * @memberOf FileAST
     */
    public parseUsingAcorn(options?: any) {
        try {
            this.ast = acornParse(this.file.contents, options);
        } catch (err) {
            return PrettyError.errorWithContents(err, this.file);
        }
    }

    public handleAliasReplacement(requireStatement: string): string {

        if (!this.file.context.experimentalAliasEnabled) {
            return requireStatement;
        }
        // enable aliases only for the current project
        // if (this.file.collection.name !== this.file.context.defaultPackageName) {
        //    return requireStatement;
        // }

        const aliasCollection = this.file.context.aliasCollection;
        aliasCollection.forEach(props => {
            if (props.expr.test(requireStatement)) {
                requireStatement = requireStatement.replace(props.expr, `${props.replacement}$2`);
                // only if we need it

                this.requiresRegeneration = true;
            }
        });
        return requireStatement;
    }

    public addDependency(name: string) {
        this.dependencies.push(name);
    }

    public resetDependencies() {
        this.dependencies = [];
    }

    public nodeIsString(node) {
        return node.type === "Literal" || node.type === "StringLiteral";
    }

    public analyze() {
        // We don't want to make analysis 2 times
        if (this.wasAnalysed || this.skipAnalysis) {
            return;
        }

        ASTTraverse.traverse(this.ast, {
            pre: (node, parent, prop, idx) =>
                plugins.forEach(plugin => plugin.onNode(this.file, node, parent)),
        });

        plugins.forEach(plugin => plugin.onEnd(this.file));

        this.wasAnalysed = true;
        // regenerate content
        if (this.requiresRegeneration) {
            this.file.contents = this.file.context.generateCode(this.ast);
        }
    }
}
