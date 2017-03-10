"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Utils_1 = require("../Utils");
class MissingImportsRemoval {
    constructor(collection) {
        this.collection = collection;
    }
    ensureAll() {
        this.collection.forEach((file, fileName) => {
            const baseDir = path.dirname(fileName);
            file.localImports.forEach(imports => {
                imports.forEach((importDeclaration, localName) => {
                    let target = path.join(baseDir, importDeclaration.localReference);
                    target = Utils_1.ensureFuseBoxPath(target);
                    let file = this.findFile(target);
                    if (file) {
                        if (!file.inExports(importDeclaration.name)) {
                            importDeclaration.remove();
                        }
                    }
                });
            });
        });
    }
    findFile(userPath) {
        let file;
        const variations = [".js", "/index.js", ".jsx", "/index.jsx"];
        if (!/jsx?/.test(userPath)) {
            variations.forEach(variant => {
                let probe = userPath + variant;
                probe = probe.replace(/\/\//, "");
                if (this.collection.get(probe)) {
                    file = this.collection.get(probe);
                }
                return false;
            });
        }
        return file;
    }
}
exports.MissingImportsRemoval = MissingImportsRemoval;
