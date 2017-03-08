import { VirtualFile } from "./VirtualFile";
import * as path from "path";
import { ensureFuseBoxPath } from "../Utils";

export class MissingImportsRemoval {
    constructor(public collection: Map<string, VirtualFile>) {
    }

    public ensureAll() {
        this.collection.forEach((file, fileName) => {
            const baseDir = path.dirname(fileName);
            file.localImports.forEach(imports => {
                imports.forEach((importDeclaration, localName) => {
                    let target = path.join(baseDir, importDeclaration.localReference);
                    target = ensureFuseBoxPath(target);
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

    private findFile(userPath) {
        let file: VirtualFile;
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
