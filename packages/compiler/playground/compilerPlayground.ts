import { readFileSync } from 'fs';
import { compileModule } from '../program/compileModule';

let file;

//file = readFileSync(__dirname + '/source_test/angular_1.ts').toString();
file = readFileSync(__dirname + '/sample.tsx').toString();
const result = compileModule({ code: file });
// const result = compileModule({
//   code: `

//   import MySuperClass, * as everything from "module-name";
//   everything.something();

//   console.log(everything);
//   new MySuperClass();

// `,
// });
console.log(result.code);
