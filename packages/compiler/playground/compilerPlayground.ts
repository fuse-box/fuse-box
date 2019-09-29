import { compileModule } from '../program/compileModule';

const result = compileModule({
  code: `
  class HelloWorld {

    constructor(public welcome: string,
                private to: string,
                protected awesomeness: string,
                hey: number,
                fuse?: boolean) {

    }
}
    `,
});
console.log(result.code);
