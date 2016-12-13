const acorn = require("acorn");
const path = require("path");
console.log(path.dirname(process.cwd()));

const ASTQ = require("astq");
const fs = require("fs");

let astq = new ASTQ();
require("acorn-es7")(acorn);
require("acorn-jsx/inject")(acorn);

let ast = acorn.parse(fs.readFileSync(__dirname + "/file.js").toString(), {
    sourceType: "module",
    tolerant: true,
    ecmaVersion: 8,
    plugins: { es7: true, jsx: true },
    jsx: { allowNamespacedObjects: true }

});
let q = `
    // CallExpression[/Identifier[@name=="require"]], 
    / ImportDeclaration[/Literal],
    // VariableDeclarator/Identifier[@name=="process"], 
    // MemberExpression/Identifier[@name=="process"]

`

var traverse = require("ast-traverse");

// print AST node types, pre-order (node first, then its children) 
traverse(ast, {
    pre: function(node, parent, prop, idx) {
        //console.log(node);
        if (node.type === "Identifier") {
            // require("./foo.js");
            if (node.name === "require") {
                if (parent.type === "CallExpression") {
                    if (parent.callee && parent.callee.name) {
                        if (parent.callee.name === "require" && parent.arguments) {
                            let arg1 = parent.arguments[0];
                            if (arg1) {
                                if (arg1.type === "Literal") {
                                    console.log(arg1.value);
                                }
                            }

                        }
                    }
                }
            }
        }
        //console.log(node, prop);

    }
});
console.log();

// let matches = astq.query(ast, q);

// console.log(JSON.stringify(ast, 2, 2));
// console.log(matches[0].prototype);
// matches.map(item => {
//     //console.log("GOT", item.parent());
//     // if (item.name === "process") {
//     //     console.log(item);
//     // }
//     // // es5 require
//     // if (item.arguments) {
//     //     if (item.arguments[0]) {
//     //         let name = item.arguments[0].value;
//     //         if (!name) { return; }
//     //         console.log(name);
//     //     }
//     // }
//     // // es6 import
//     // if (item.source) { console.log(item.source.value) }
// });