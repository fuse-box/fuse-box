import { bench } from './bench';
import * as ts from 'typescript';
import { readFileSync } from 'fs';
import { compileModule } from '../program/compileModule';
const b = bench({ iterations: 1000 });
const fileName = __dirname + '/source_test/random.tsx';

const file = readFileSync(fileName).toString();

b.measure('Fuse compiler', i => {
  compileModule({ code: file });
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
