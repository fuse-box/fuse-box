import { readFileSync } from 'fs';
import * as ts from 'typescript';
import { testTranspile } from '../transpilers/testTranpiler';
import { bench } from './bench';

const b = bench({ iterations: 1000 });
const fileName = __dirname + '/source_test/random.tsx';

const file = readFileSync(fileName).toString();

b.measure('Fuse compiler', i => {
  testTranspile({ code: file });
});

b.measure('Typescript compiler', i => {
  const compilerOptions: ts.CompilerOptions = {
    module: ts.ModuleKind.CommonJS,
  };
  ts.transpileModule(file, {
    fileName,
    compilerOptions,
  });
});

b.start();
