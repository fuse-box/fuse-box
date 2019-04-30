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

export class SuperClass {
  private bar: number;
  constructor() {
    this.bar = Math.random();
  }

  public getSomething() {
    return Math.random() + this.bar;
  }

  public doSomething() {
    return Math.random() + this.bar;
  }

  public read() {
    return this.bar;
  }
}

function createSuperClass2(): any {
  let _bar = Math.random();
  return {
    read: () => _bar,
    getSomething: () => Math.random() + _bar,
    doSomething: () => Math.random() + _bar,
  };
}
//methods: { [key: string]: any }

function createImmutableScope<S, R>(fn: (scope: S) => { [key: string]: any }): R {
  return fn({} as S) as R;
}

const maxIteration = 2000;
for (let i = 0; i <= maxIteration; i++) {
  measure('using classes', () => {
    const a = new SuperClass();
    a.doSomething();
    a.getSomething();
    a.read();
  });
  measure('using fn', () => {
    const a = createSuperClass2();
    a.doSomething();
    a.getSomething();
    a.read();
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
