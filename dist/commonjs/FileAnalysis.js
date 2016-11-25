"use strict";
const acorn = require("acorn");
const ASTQ = require("astq");
let astq = new ASTQ();
require("acorn-es7")(acorn);
require("acorn-jsx/inject")(acorn);
class FileAnalysis {
    constructor(file) {
        this.file = file;
        this.dependencies = [];
    }
    process() {
        this.parse();
        this.processNodejsVariables();
        this.processDependencies();
    }
    parse() {
        this.ast = acorn.parse(this.file.contents, {
            sourceType: "module",
            tolerant: true,
            ecmaVersion: 8,
            plugins: { es7: true, jsx: true },
            jsx: { allowNamespacedObjects: true }
        });
    }
    processDependencies() {
        let matches = astq.query(this.ast, `// CallExpression[/Identifier[@name=="require"]], / ImportDeclaration[/Literal]`);
        matches.map(item => {
            if (item.arguments) {
                if (item.arguments[0]) {
                    let name = item.arguments[0].value;
                    if (!name) {
                        return;
                    }
                    this.dependencies.push(name);
                }
            }
            if (item.source) {
                this.dependencies.push(item.source.value);
            }
        });
    }
    extractStreamVariables() {
        let streamisDefined = astq.query(this.ast, `// VariableDeclarator/Identifier[@name=="stream"]`);
        if (streamisDefined.length) {
            return;
        }
        let result = astq.query(this.ast, `// MemberExpression/Identifier[@name=="stream"]`);
        if (!result.length) {
            return;
        }
        this.dependencies.push("stream");
        this.file.addHeaderContent(`if ( typeof window !== "undefined" ) { var stream = require("stream"); }`);
    }
    processNodejsVariables() {
        let processIsDefined = astq.query(this.ast, `// VariableDeclarator/Identifier[@name=="process"]`);
        if (processIsDefined.length) {
            return;
        }
        let result = astq.query(this.ast, `// MemberExpression/Identifier[@name=="process"]`);
        if (!result.length) {
            return;
        }
        this.dependencies.push("process");
        this.file.addHeaderContent(`var process = require("process");`);
    }
}
exports.FileAnalysis = FileAnalysis;
