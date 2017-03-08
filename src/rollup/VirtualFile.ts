import { acornParse } from "../analysis/FileAnalysis";
import { ASTTraverse } from "../ASTTraverse";
import * as escodegen from "escodegen";

export class ImportDeclaration {
    public name: string;
    public isDefault = false;
    public localReference: string;
    constructor(public item: any, public node: any, public parent) {
        this.name = item.imported && item.imported.name;
        this.localReference = node.source && node.source.value;
        this.isDefault = item.imported === undefined;
    }

    public remove() {
        let specifiers = this.node.specifiers;
        let index = specifiers.indexOf(this.item);
        specifiers.splice(index, 1);

        // if nothing left in the declaration -> remove it
        if (specifiers.length === 0) {
            let body = this.parent.body;
            let index = body.indexOf(this.node);
            body.splice(index, 1);
        }
    }
}

/**
 *
 *
 * @export
 * @interface VirtualFile
 */
export class VirtualFile {
    public exports: string[] = [];
    public ast: any;
    public defaultExports = false;
    public localImports = new Map<string, Map<string, ImportDeclaration>>();

    constructor(public contents) {
        this.ast = acornParse(contents);

        ASTTraverse.traverse(this.ast, {
            pre: (node, parent, prop, idx) => {
                if (node.type === "ExportNamedDeclaration") {
                    // Exports {}
                    if (node.declaration && node.declaration.id) {
                        this.exports.push(node.declaration.id.name);
                    }
                }
                // we just care if it's there...
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

    public inExports(name: string) {
        return this.exports.indexOf(name) > -1;
    }

    public generate() {
        return escodegen.generate(this.ast);
    }

    /**
     * Extract imports
     * @param node
     * @param parent
     */
    private registerImportDeclaration(node: any, parent: any) {
        if (node.source) {
            if (/^[\.~]/.test(node.source.value)) {
                let map = this.localImports.get(node.source.value) || new Map<string, ImportDeclaration>();
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
