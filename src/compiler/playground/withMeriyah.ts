import { readFileSync } from 'fs';
import * as meriyah from 'meriyah';
import { generate } from '../generator/generator';
import { javascriptTranspiler } from '../transpilers/javascriptTranspiler';

let file;

//file = readFileSync(__dirname + '/source_test/angular_1.ts').toString();
file = readFileSync(__dirname + '/sample1.ts').toString();

const ast = meriyah.parse(file, { jsx: true, next: false, module: true, loc: true });

const transformed = javascriptTranspiler({
  ast: ast,
  env: {},
  isBrowser: true,
  isServer: false,
  moduleFileName: 'index.js',
  target: 'browser',
});
//console.log(JSON.stringify(transformed.ast));
const res = generate(transformed.ast, {});
console.log(res);
