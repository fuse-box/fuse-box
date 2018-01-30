import * as acorn from "acorn";
import { File } from "../core/File";
import { escapeRegExp } from "../Utils";
import { ASTTraverse } from "./../ASTTraverse";
import { PrettyError } from "./../PrettyError";
import { AutoImport } from "./plugins/AutoImport";
import { DynamicImportStatement } from "./plugins/DynamicImportStatement";
import { ImportDeclaration } from "./plugins/ImportDeclaration";
import { LanguageLevel } from "./plugins/LanguageLevel";
import { OwnBundle } from "./plugins/OwnBundle";
import { OwnVariable } from "./plugins/OwnVariable";
// tslint:disable-next-line:no-var-requires no-submodule-imports
require("acorn-jsx/inject")(acorn);
// tslint:disable-next-line:no-var-requires
require("./acorn-ext/obj-rest-spread")(acorn);

export interface TraversalPlugin {
    onNode(file: File, node: any, parent: any): void;
    onEnd(file: File): void;
}

const plugins: TraversalPlugin[] = [
    AutoImport,
    OwnVariable,
    OwnBundle,
    ImportDeclaration,
    DynamicImportStatement,
    LanguageLevel,
];

export function acornParse(contents, options?: any) {
    return acorn.parse(contents, {
        ...(options || {}),
        ...{
            ecmaVersion: "2018",
            jsx: { allowNamespacedObjects: true },
            locations: true,
            plugins: {
                jsx: true,
                objRestSpread: true,
            },
            ranges: true,
            sourceType: "module",
            tolerant: true,
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
    ast: any;

    skipAnalysis = false;

    bannedImports = {};

    nativeImports = {};

    fuseBoxMainFile;

    requiresRegeneration = false;

    statementReplacement = new Set<{ from: string; to: string }>();

    requiresTranspilation = false;

    fuseBoxVariable = "FuseBox";

    dependencies: string[] = [];

    private wasAnalysed = false;

    constructor(public file: File) {}

    astIsLoaded(): boolean {
        return this.ast !== undefined;
    }

    /**
     * Loads an AST
     *
     * @param {*} ast
     *
     * @memberOf FileAnalysis
     */
    loadAst(ast: any) {
        this.ast = ast;
    }

    skip() {
        this.skipAnalysis = true;
    }

    /**
     *
     *
     * @private
     *
     * @memberOf FileAST
     */
    parseUsingAcorn(options?: any) {
        try {
            this.ast = acornParse(this.file.contents, options);
        } catch (err) {
            return PrettyError.errorWithContents(err, this.file);
        }
    }

    registerReplacement(rawRequireStatement: string, targetReplacement: string) {
        if (rawRequireStatement !== targetReplacement) {
            this.statementReplacement.add({ from: rawRequireStatement, to: targetReplacement });
        }
    }

    handleAliasReplacement(requireStatement: string): string {
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

    addDependency(name: string) {
        this.dependencies.push(name);
    }

    resetDependencies() {
        this.dependencies = [];
    }

    nodeIsString(node) {
        return node.type === "Literal" || node.type === "StringLiteral";
    }

    replaceAliases(collection: Set<{ from: string; to: string }>) {
        collection.forEach(item => {
            const regExp = new RegExp(`(require|\\$fsmp\\$)\\(('|")${escapeRegExp(item.from)}('|")\\)`);
            this.file.contents = this.file.contents.replace(regExp, `$1("${item.to}")`);
        });
    }

    analyze(traversalOptions?: { plugins: TraversalPlugin[] }) {
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
            traversalPlugins = plugins.concat(traversalOptions.plugins);
        }

        ASTTraverse.traverse(this.ast, {
            pre: (node, parent, prop, idx) =>
                traversalPlugins.forEach(plugin => plugin.onNode(this.file, node, parent)),
        });

        traversalPlugins.forEach(plugin => plugin.onEnd(this.file));

        this.wasAnalysed = true;
        // regenerate content
        this.replaceAliases(this.statementReplacement);
        if (this.requiresRegeneration) {
            this.file.contents = this.file.context.generateCode(this.ast, {});
        }

        if (this.requiresTranspilation) {
            const result = this.file.transpileUsingTypescript();
            this.file.contents = result.outputText;
        }
    }
}
