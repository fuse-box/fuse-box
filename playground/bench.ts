import { METHODS } from 'http';

const { performance } = require('perf_hooks');

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

const arr = [];
const maxIteration = 2000;

function isArray1(obj) {
  return Array.isArray(arr);
}

function isArray2(obj) {
  return typeof obj !== 'undefined' && obj && obj.constructor === Array;
}
function isArray3(obj) {
  return obj instanceof Array;
}

console.log(arr instanceof Array);
for (let i = 0; i <= maxIteration; i++) {
  measure('isArray1', () => {
    isArray1(arr);
  });
  measure('isArray2', () => {
    isArray2(arr);
  });
  measure('isArray3', () => {
    isArray3(arr);
  });
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
