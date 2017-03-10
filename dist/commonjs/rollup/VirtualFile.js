"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileAnalysis_1 = require("../analysis/FileAnalysis");
const ASTTraverse_1 = require("../ASTTraverse");
const escodegen = require("escodegen");
class ImportDeclaration {
    constructor(item, node, parent) {
        this.item = item;
        this.node = node;
        this.parent = parent;
        this.isDefault = false;
        this.name = item.imported && item.imported.name;
        this.localReference = node.source && node.source.value;
        this.isDefault = item.imported === undefined;
    }
    remove() {
        let specifiers = this.node.specifiers;
        let index = specifiers.indexOf(this.item);
        specifiers.splice(index, 1);
        if (specifiers.length === 0) {
            let body = this.parent.body;
            let index = body.indexOf(this.node);
            body.splice(index, 1);
        }
    }
}
exports.ImportDeclaration = ImportDeclaration;
class VirtualFile {
    constructor(contents) {
        this.contents = contents;
        this.exports = [];
        this.defaultExports = false;
        this.localImports = new Map();
        this.ast = FileAnalysis_1.acornParse(contents);
        ASTTraverse_1.ASTTraverse.traverse(this.ast, {
            pre: (node, parent, prop, idx) => {
                if (node.type === "ExportNamedDeclaration") {
                    if (node.declaration && node.declaration.id) {
                        this.exports.push(node.declaration.id.name);
                    }
                }
                if (node.type === "ExportDefaultDeclaration") {
                    if (node.declaration && node.declaration.id) {
                        this.defaultExports = true;
                    }
                }
                if (node.type === "ImportDeclaration") {
                    this.registerImportDeclaration(node, parent);
                }
            },
        });
    }
    inExports(name) {
        return this.exports.indexOf(name) > -1;
    }
    generate() {
        return escodegen.generate(this.ast);
    }
    registerImportDeclaration(node, parent) {
        if (node.source) {
            if (/^[\.~]/.test(node.source.value)) {
                let map = this.localImports.get(node.source.value) || new Map();
                node.specifiers.forEach(item => {
                    if (item.type === "ImportSpecifier") {
                        let declaration = new ImportDeclaration(item, node, parent);
                        map.set(declaration.name, declaration);
                    }
                    if (item.type === "ImportDefaultSpecifier") {
                        let declaration = new ImportDeclaration(item, node, parent);
                        map.set("@default", declaration);
                    }
                });
                this.localImports.set(node.source.value, map);
            }
        }
    }
}
exports.VirtualFile = VirtualFile;
