"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AutoImport {
    static onNode(file, node, parent) {
        const analysis = file.analysis;
        let modules = file.context.autoImportConfig;
        if (node.type === "Identifier") {
            if (modules[node.name] && !analysis.bannedImports[node.name]) {
                const belongsToAnotherObject = parent.type === "MemberExpression" && parent.object && parent.object.type === "Identifier" && parent.object.name !== node.name;
                if (belongsToAnotherObject) {
                    return;
                }
                const isProperty = parent.type && parent.type === "Property" && parent.value && parent.value.name !== node.name;
                const isFunction = parent.type
                    && (parent.type === "FunctionExpression" ||
                        parent.type === "FunctionDeclaration") && parent.params;
                const isDeclaration = parent.type === "VariableDeclarator" || parent.type === "FunctionDeclaration";
                if (isProperty || isFunction || parent && isDeclaration
                    && parent.id && parent.id.type === "Identifier" && parent.id.name === node.name) {
                    delete analysis.nativeImports[node.name];
                    if (!analysis.bannedImports[node.name]) {
                        analysis.bannedImports[node.name] = true;
                    }
                }
                else {
                    analysis.nativeImports[node.name] = modules[node.name];
                }
            }
        }
    }
    static onEnd(file) {
        const analysis = file.analysis;
        if (file.headerContent) {
            file.headerContent = [];
        }
        for (let nativeImportName in analysis.nativeImports) {
            if (analysis.nativeImports.hasOwnProperty(nativeImportName)) {
                const nativeImport = analysis.nativeImports[nativeImportName];
                analysis.dependencies.push(nativeImport.pkg);
                file.addHeaderContent(nativeImport.getImportStatement());
            }
        }
    }
}
exports.AutoImport = AutoImport;
