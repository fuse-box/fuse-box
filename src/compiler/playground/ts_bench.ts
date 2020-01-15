import { readFileSync } from 'fs';
import * as ts from 'typescript';
import { testTranspile } from '../transpilers/testTranspiler';
import { bench } from './bench';

function jsBench() {
  const b = bench({ iterations: 5 });
  const fileName = __dirname + '/source_test/react.dom.development.js';
  const file = readFileSync(fileName).toString();
  b.measure('fuse', i => {
    testTranspile({ code: file, useMeriyah: false, fileName: fileName });
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
}

function jsxBench() {
  const b = bench({ iterations: 10 });
  const fileName = __dirname + '/source_test/jsx_test.tsx';
  const file = readFileSync(fileName).toString();
  b.measure('fuse', i => {
    testTranspile({ code: file, fileName: fileName });
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
}

jsBench();
