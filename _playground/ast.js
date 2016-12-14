const acorn = require("acorn");
const fs = require("fs");

require("acorn-es7")(acorn);
require("acorn-jsx/inject")(acorn);

let ast = acorn.parse(fs.readFileSync(__dirname + "/file.js").toString(), {
    sourceType: "module",
    tolerant: true,
    ecmaVersion: 8,
    plugins: { es7: true, jsx: true },
    jsx: { allowNamespacedObjects: true }

});



var traverse = require("ast-traverse");

// print AST node types, pre-order (node first, then its children) 
var out = {
    requires: [],
    processDeclared: false,
    processRequired: false,
    fuseBoxBundle: false
}
traverse(ast, {
    pre: function(node, parent, prop, idx) {

        if (node.type === "MemberExpression") {
            if (node.object && node.object.type === "Identifier") {
                if (node.object.name === "process") {
                    out.processRequired = true;
                }
            }
            if (parent.type === "CallExpression") {
                if (node.object && node.object.type === "Identifier" && node.object.name === "FuseBox") {
                    if (node.property && node.property.type === "Identifier") {
                        if (node.property.name === "pkg") {
                            out.fuseBoxBundle = true;
                        }
                    }
                }
            }
        }
        if (node.type === "VariableDeclarator") {
            if (node.id && node.id.type === "Identifier" && node.id.name === "process") {
                out.processDeclared = true;
            }
        }
        if (node.type === "ImportDeclaration") {
            if (node.source && node.source.type === "Literal") {
                out.requires.push(node.source.value);
            }
        }
        if (node.type === "CallExpression") {
            if (node.callee.type === "Identifier" && node.callee.name === "require") {
                let arg1 = node.arguments[0];
                if (arg1.type === "Literal") {
                    out.requires.push(arg1.value);
                }
            }
        }
    }
});
console.log(out);