import { readFileSync } from "fs";
import { compileModule } from "../program/compileModule";
const code = readFileSync(__dirname + "/sample.ts").toString();
//transpile({ code: code });

const result = compileModule({ code: code });
console.log(result.code);
//console.log(JSON.stringify(ast, null, 2));
