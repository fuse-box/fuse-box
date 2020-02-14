import { testTranspile } from '../transpilers/testTranspiler';

let file;

const code = testTranspile({
  compilerOptions: {
    esModuleInterop: true,
    esModuleStatement: true,
    experimentalDecorators: true,
    jsxFactory: 'React.createElement',
  },
  fileName: __dirname + '/sample1.tsx',
});
console.log(code);
// console.log('here');
// //console.log(code);
// const res = prettier.format(code, {});
// console.log(res);
// //file = readFileSync(__dirname + '/source_test/angular_1.ts').toString();
// file = readFileSync(__dirname + '/sample1.ts').toString();
// const result = testTranspile({
//   withJSX: false,
//   code: file,
//   emitDecoratorMetadata: true,
//   bundleProps: { target: 'browser', env: { NODE_ENV: 'development' } },
// });

// console.log(result.code);
