import { FastVisit } from '../Visitor/Visitor';
import { createGlobalContext } from '../program/GlobalContext';

const parser = require('@typescript-eslint/typescript-estree');
const code = `
class Foo{

  constructor(@foo public welcome: string){}
}

`;
const ast = parser.parse(code, {
  // range: false,
  // loc: false,
  jsx: false,
});

FastVisit({
  ast: ast,
  globalContext: createGlobalContext(),
  fn: visit => {
    console.log(visit.node.type);
  },
});
console.log(JSON.stringify(ast, null, 2));
