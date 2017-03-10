"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OwnVariable {
    static onNode(file, node, parent) {
        const analysis = file.analysis;
        if (node.type === "Identifier") {
            if (node.name === "$fuse$") {
                analysis.fuseBoxVariable = parent.object.name;
            }
        }
    }
    static onEnd() { }
}
exports.OwnVariable = OwnVariable;
