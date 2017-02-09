const acorn = require("acorn");
const escodegen = require("escodegen");
require("acorn-es7")(acorn);
require("acorn-jsx/inject")(acorn);
const fs = require("fs");

var stackTrace = require('stack-trace');
const lodash = require("lodash");


console.log(lodash.each.toString());



const contents = fs.readFileSync(__dirname + "/_build/out.js").toString();

const ast = acorn.parse(contents, {
    sourceType: "module",
    tolerant: true,
    ecmaVersion: 8,
    plugins: { es7: true, jsx: true },
    jsx: { allowNamespacedObjects: true }

});

//console.log(ast);