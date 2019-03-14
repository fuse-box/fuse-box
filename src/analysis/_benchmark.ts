const { performance } = require('perf_hooks');
import * as acorn from 'acorn';
import * as fs from 'fs';
import * as path from 'path';
import { fastAnalysis } from './fastAnalysis';
import * as cherow from 'cherow';
const str = fs.readFileSync(path.join(__dirname, 'file.js')).toString();

function parseWithAcorn(input) {
  acorn.parse(input, {
    sourceType: 'module',
    tolerant: true,
    locations: true,
    ranges: true,
    ecmaVersion: '2018',
  });
}

function parseWithCherow(input) {
  cherow.parse(input);
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
  measure('parseWithAcorn', () => parseWithAcorn(str));
  measure('parseWithCherow', () => parseWithCherow(str));
  measure('fastAnalysis', () => fastAnalysis({ input: str }));
  // measure('tsParser (create source + getImports from AST)', () => {
  //   const sourceFile = createSourceFile('module.tsx', str);
  //   return getImports(sourceFile);
  // });
  // measure('tsParser (getImports from AST)', () => getImports(source));
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
