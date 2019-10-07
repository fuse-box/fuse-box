import { readFileSync } from 'fs';
import * as ts from 'typescript';
import { testTranspile } from '../transpilers/testTranspiler';
import { bench } from './bench';

const b = bench({ iterations: 100 });
const fileName = __dirname + '/source_test/random.tsx';

const file = readFileSync(fileName).toString();

b.measure('fuse', i => {
  testTranspile({ code: file });
});

b.measure('typescript', i => {
  const compilerOptions: ts.CompilerOptions = {
    module: ts.ModuleKind.CommonJS,
  };
  ts.transpileModule(file, {
    fileName,
    compilerOptions,
  });
});

b.start(result => {
  const difference = result.typescript / result.fuse;
  console.log(`Difference ${difference}`);
});
