import { bench } from './bench';
import * as ts from 'typescript';
import { readFileSync } from 'fs';
import { compileModule } from '../program/compileModule';
const b = bench({ iterations: 5 });
const fileName = __dirname + '/source_test/angular_1.ts';
const file = readFileSync(fileName).toString();
b.measure('Typescript compiler', i => {
  const compilerOptions: ts.CompilerOptions = {
    module: ts.ModuleKind.CommonJS,
  };
  const code = ts.transpileModule(file, {
    fileName,
    compilerOptions,
  });
});

b.measure('Fuse compiler', i => {
  compileModule({ code: file });
});

b.start();
