const { performance } = require('perf_hooks');
import * as acorn from 'acorn';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { fastTransform } from './fastTransform';

const str = fs.readFileSync(path.join(__dirname, '_test.txt')).toString();

function transpileWithTypescript(input) {
  ts.transpileModule(input, {
    compilerOptions: {
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
    },
  });
}

function transpileWithFuseBox(input) {
  fastTransform({ input: input });
}

const result: any = {};

function measure(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const time = performance.now() - start;
  if (!result[name]) {
    result[name] = [];
  }
  result[name].push(time);
  //console.log(`${name} in: ${time}ms`);
  return name;
}

for (let i = 0; i < 100; i++) {
  measure('Typescript tranform', () => transpileWithTypescript(str));
  measure('FuseBox tranform', () => transpileWithFuseBox(str));
}

for (const item in result) {
  const totalRuns = result[item].length;
  let totalTime = 0;
  result[item].map(time => {
    totalTime += time;
  });
  const avgTime = totalTime / totalRuns;
  console.log(`${item}: ${avgTime}ms (${totalRuns} runs) `);
}
// //const acornTime = ;

// function parseWithShit(input) {
// 	console.log(result);
// 	return performance.now() - start;
// }
