const tsc = require('typescript-compiler');
const appRoot = require("app-root-path");
const path = require("path")

const ts = require("typescript")
const source = `import * as path from 'path'
path.join("a", "b");
import {foo} from "./foo"
foo.hello();
`;

setInterval(() => {
    console.time("ts");
    let result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, inlineSourceMap: true } });
    console.timeEnd("ts")
    console.log(result);
}, 1000);