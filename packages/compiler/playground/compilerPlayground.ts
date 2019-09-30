import { compileModule } from '../program/compileModule';

const result = compileModule({
  code: `
  class A {
    constructor(
      public name = class {
        constructor(public hey = 2) {}
      },
    ) {}
  }

`,
});
console.log(result.code);
