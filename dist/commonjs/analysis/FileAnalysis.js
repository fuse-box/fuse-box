"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTTraverse_1 = require("./../ASTTraverse");
const PrettyError_1 = require("./../PrettyError");
const acorn = require("acorn");
const AutoImport_1 = require("./plugins/AutoImport");
const OwnVariable_1 = require("./plugins/OwnVariable");
const OwnBundle_1 = require("./plugins/OwnBundle");
const ImportDeclaration_1 = require("./plugins/ImportDeclaration");
require("acorn-es7")(acorn);
require("acorn-jsx/inject")(acorn);
const plugins = [AutoImport_1.AutoImport, OwnVariable_1.OwnVariable, OwnBundle_1.OwnBundle, ImportDeclaration_1.ImportDeclaration];
function acornParse(contents, options) {
    return acorn.parse(contents, Object.assign({}, options || {}, {
        sourceType: "module",
        tolerant: true,
        ecmaVersion: 8,
        plugins: { es7: true, jsx: true },
        jsx: { allowNamespacedObjects: true },
    }));
}
exports.acornParse = acornParse;
class FileAnalysis {
    constructor(file) {
        this.file = file;
        this.wasAnalysed = false;
        this.skipAnalysis = false;
        this.bannedImports = {};
        this.nativeImports = {};
        this.requiresRegeneration = false;
        this.fuseBoxVariable = "FuseBox";
        this.dependencies = [];
    }
    astIsLoaded() {
        return this.ast !== undefined;
    }
    loadAst(ast) {
        this.ast = ast;
    }
    skip() {
        this.skipAnalysis = true;
    }
    parseUsingAcorn(options) {
        try {
            this.ast = acornParse(this.file.contents, options);
        }
        catch (err) {
            return PrettyError_1.PrettyError.errorWithContents(err, this.file);
        }
    }
    handleAliasReplacement(requireStatement) {
        if (!this.file.context.experimentalAliasEnabled) {
            return requireStatement;
        }
        const aliasCollection = this.file.context.aliasCollection;
        aliasCollection.forEach(props => {
            if (props.expr.test(requireStatement)) {
                requireStatement = requireStatement.replace(props.expr, `${props.replacement}$2`);
                this.requiresRegeneration = true;
            }
        });
        return requireStatement;
    }
    addDependency(name) {
        this.dependencies.push(name);
    }
    resetDependencies() {
        this.dependencies = [];
    }
    nodeIsString(node) {
        return node.type === "Literal" || node.type === "StringLiteral";
    }
    analyze() {
        if (this.wasAnalysed || this.skipAnalysis) {
            return;
        }
        ASTTraverse_1.ASTTraverse.traverse(this.ast, {
            pre: (node, parent, prop, idx) => plugins.forEach(plugin => plugin.onNode(this.file, node, parent)),
        });
        plugins.forEach(plugin => plugin.onEnd(this.file));
        this.wasAnalysed = true;
        if (this.requiresRegeneration) {
            this.file.contents = this.file.context.generateCode(this.ast);
        }
    }
}
exports.FileAnalysis = FileAnalysis;
