import { ASTTraverse } from "./../ASTTraverse";
import { PrettyError } from "./../PrettyError";
import { File, ScriptTarget } from "../core/File";
import * as acorn from "acorn";
import { AutoImport } from "./plugins/AutoImport";
import { LanguageLevel } from "./plugins/LanguageLevel";
import { OwnVariable } from "./plugins/OwnVariable";
import { OwnBundle } from "./plugins/OwnBundle";
import { ImportDeclaration } from "./plugins/ImportDeclaration";
import { DynamicImportStatement } from "./plugins/DynamicImportStatement";
require("acorn-jsx/inject")(acorn);
require("./acorn-ext/obj-rest-spread")(acorn);

export interface TraversalPlugin {
    onNode(file: File, node: any, parent: any): void
    onEnd(file: File): void
}

const plugins: TraversalPlugin[] = [AutoImport, OwnVariable, OwnBundle, ImportDeclaration, DynamicImportStatement, LanguageLevel];

export function acornParse(contents, options?: any) {
    return acorn.parse(contents, {
        ...options || {}, ...{
            sourceType: "module",
            tolerant: true,
            locations: true,
            ranges: true,
            ecmaVersion: '2018',
            plugins: {
                jsx: true, objRestSpread: true
            },
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

    public skipAnalysis = false;

    public bannedImports = {};

    public nativeImports = {};

    public fuseBoxMainFile;

    public requiresRegeneration = false;

    public stringReplacement = new Set<{from: string, to : string}>();

    public requiresTranspilation = false;

    public fuseBoxVariable = "FuseBox";

    public dependencies: string[] = [];

    constructor(public file: File) { }


    public add2Replacement(from : string, to : string){
        this.stringReplacement.add({from : from, to : to})
    }
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

    public analyze(traversalOptions?: { plugins: TraversalPlugin[] }) {
        // We don't want to make analysis 2 times
        if (this.wasAnalysed || this.skipAnalysis) {
            return;
        }
        // setting es6 module
        // to transpile it with typescrip
        if (this.file.collection && this.file.collection.info && this.file.collection.info.jsNext) {
            this.file.es6module = true;
        }

        let traversalPlugins = plugins;
        if (traversalOptions && Array.isArray(traversalOptions.plugins)) {
            traversalPlugins = plugins.concat(traversalOptions.plugins)
        }


        ASTTraverse.traverse(this.ast, {
            pre: (node, parent, prop, idx) =>
                traversalPlugins.forEach(plugin => plugin.onNode(this.file, node, parent)),
        });

        traversalPlugins.forEach(plugin => plugin.onEnd(this.file));

        this.wasAnalysed = true;
        // regenerate content
        this.stringReplacement.forEach(item => {
            this.file.contents = this.file.contents.replace(item.from, item.to)
        })

        if (this.requiresRegeneration) {
            
            this.file.contents = this.file.context.generateCode(this.ast, {
            });
        }

        if (this.requiresTranspilation) {
            const target = ScriptTarget[this.file.context.languageLevel]
            this.file.context.log.magicReason(
                'compiling with typescript to match language target: ' + target,
                this.file.info.fuseBoxPath
            );
            const ts = require("typescript");
            let tsconfg: any = {
                compilerOptions: {
                    module: "commonjs",
                    target
                }
            };
            let result = ts.transpileModule(this.file.contents, tsconfg);
            this.file.contents = result.outputText;
        }

    }
}
