import { readFileSync } from "fs";
import { compileModule } from "../program/compileModule";
import * as buntis from "buntis";
const code = readFileSync(__dirname + "/sample.ts").toString();
//transpile({ code: code });
const ast = buntis.parseTSModule(code, {
  directives: true,
  jsx: true,
  next: true,
  loc: true,
  ts: true
});
console.log(JSON.stringify(ast, null, 2));
