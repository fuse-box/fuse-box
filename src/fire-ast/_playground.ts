import { fireAst } from './fireAst';

const tokens = fireAst(`
import "./raw"
import * as from "./from-import";


import("./dynamic-import")

const process = {};



/*
  require('./bullshit')
*/

asdfrequire("should not take")
export * as a;





`);

console.log(tokens);
