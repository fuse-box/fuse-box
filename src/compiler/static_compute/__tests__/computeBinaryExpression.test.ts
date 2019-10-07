import * as buntis from 'buntis';
import { ASTNode } from '../../interfaces/AST';
import { computeBinaryExpression } from '../computeBinaryExpression';

function getAst(expression: string): ASTNode {
  const ast = buntis.parseTSModule(expression, {
    directives: true,
    jsx: true,
    next: true,
    loc: true,
    ts: true,
  });
  return ast.body[0]['expression'];
}
describe('Compute binary expression', () => {
  it('sample 1', () => {
    const res = computeBinaryExpression(getAst('1+2*2'));
    expect(res.value).toEqual(5);
  });

  it('sample 2', () => {
    const res = computeBinaryExpression(getAst('1+2*2+(5*2)'));
    expect(res.value).toEqual(15);
  });
  it('sample 3', () => {
    const res = computeBinaryExpression(getAst('1+2*2+(5*0x23)'));
    expect(res.value).toEqual(180);
  });
  it('sample 4', () => {
    const res = computeBinaryExpression(getAst('10%2'));
    expect(res.value).toEqual(0);
  });
  it('sample 5', () => {
    const res = computeBinaryExpression(getAst('1<<2'));
    expect(res.value).toEqual(4);
  });
  it('sample 6', () => {
    const res = computeBinaryExpression(getAst('1>>2'));
    expect(res.value).toEqual(0);
  });
  it('sample 7', () => {
    const res = computeBinaryExpression(getAst('5>>>1'));
    expect(res.value).toEqual(2);
  });
  it('sample 8', () => {
    const res = computeBinaryExpression(getAst('2**10'));
    expect(res.value).toEqual(1024);
  });

  it('sample 1 with variable', () => {
    const res = computeBinaryExpression(getAst('Read | Write'), {
      Read: 1 << 1,
      Write: 1 << 2,
    });
    expect(res.value).toEqual(6);
  });

  it('sample 2 with variable', () => {
    const res = computeBinaryExpression(getAst('(Read | 1 << 2) + 20 / 10'), {
      Read: 1 << 1,
      Write: 1 << 2,
    });
    expect(res.value).toEqual(8);
  });

  it('sample 3 with variable', () => {
    const res = computeBinaryExpression(getAst('(Read | Write) + 20'), {
      Read: 2,
      Write: 4,
    });
    expect(res.value).toEqual(26);
  });

  describe('Math', () => {
    it('Math.sin', () => {
      const res = computeBinaryExpression(getAst('20 + Math.sin(2)'), {
        Read: 2,
        Write: 4,
      });
      expect(res.value).toEqual(20.90929742682568);
    });
    it('Math - uknown function', () => {
      const res = computeBinaryExpression(getAst('20 + Math.hey(2)'), {
        Read: 2,
        Write: 4,
      });
      expect(res.value).toEqual(NaN);
    });

    it('Uknown function', () => {
      const res = computeBinaryExpression(getAst('20 + Some'), {
        Read: 2,
        Write: 4,
      });
      expect(res.value).toEqual(NaN);
    });

    it('Math without params', () => {
      const res = computeBinaryExpression(getAst('20 + Math.sin'), {
        Read: 2,
        Write: 4,
      });
      expect(res.value).toEqual(NaN);
    });

    it('Math without function', () => {
      const res = computeBinaryExpression(getAst('20 + Math'), {
        Read: 2,
        Write: 4,
      });
      expect(res.value).toEqual(NaN);
    });
  });
});
