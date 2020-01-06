import { testTranspile } from '../transpilers/testTranspiler';

let file;

const code = testTranspile({ fileName: __dirname + '/sample1.ts' });
console.log(code);
// //file = readFileSync(__dirname + '/source_test/angular_1.ts').toString();
// file = readFileSync(__dirname + '/sample1.ts').toString();
// const result = testTranspile({
//   withJSX: false,
//   code: file,
//   emitDecoratorMetadata: true,
//   bundleProps: { target: 'browser', env: { NODE_ENV: 'development' } },
// });

// console.log(result.code);
