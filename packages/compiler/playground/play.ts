import { readFileSync } from 'fs';
import { testTranspile } from '../transpilers/testTranpiler';

const code = readFileSync(__dirname + '/sample.ts').toString();
//transpile({ code: code });

const result = testTranspile({ code: code });
console.log(result.code);
//console.log(JSON.stringify(ast, null, 2));
