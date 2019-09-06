const { performance } = require('perf_hooks');
import * as acorn from 'acorn';
import * as fs from 'fs';
import * as meriyah from 'meriyah';
import * as path from 'path';
import { createFuseLogger } from '../fuse-log/FuseBoxLogAdapter';
import { fastAnalysis } from './fastAnalysis';

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

const logger = createFuseLogger({ level: 'succinct' });

//logger.withSpinner();
logger.info('bench', 'Starting benchmark');

function parsemeriyah(str) {
  return meriyah.parseModule(str);
}

const maxIteration = 100;
for (let i = 0; i <= maxIteration; i++) {
  measure('parseWithAcorn', () => parseWithAcorn(str));

  measure('meriyah', () => parsemeriyah(str));

  measure('fastAnalysis', () => fastAnalysis({ input: str }));

  // measure('doFastAst', () => doFastAst(str));
}

for (const item in result) {
  const totalRuns = result[item].length;
  let totalTime = 0;
  result[item].map(time => {
    totalTime += time;
  });
  const avgTime = totalTime / totalRuns;
  console.log(`${item}: ${avgTime}ms (${totalRuns} runs)`);
}

// //const acornTime = ;

// function parseWithShit(input) {
// 	console.log(result);
// 	return performance.now() - start;
// }
