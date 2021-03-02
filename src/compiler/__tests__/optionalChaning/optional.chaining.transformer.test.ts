import { writeFileSync } from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { fileExists, readJSONFile } from '../../../utils/utils';
import { generate } from '../../generator/generator';
import { parseJavascript } from '../../parser';
import { initCommonTransform } from '../../testUtils';
import { OptionalChaningTransformer } from '../../transformers/optionalChaining/OptionalChainingTransformer';

const testTranspile = (props: { code: string; jsx?: boolean }) => {
  return initCommonTransform({
    code: props.code,
    jsx: true,
    props: { module: {} },
    transformers: [OptionalChaningTransformer()],
  });
};

const cases: Array<string> = [
  'a?.b',
  'a?.b?.c',
  'a?.b.c',
  'a?.b?.c?.d',
  'a?.b?.c?.d?.e',
  'a?.b?.c?.d?.e?.f',
  'a.b?.c?.d?.e?.f',
  'a.b.c?.d?.e?.f',
  'a.b.c.d?.e?.f',
  'a.b?.c.d?.e.f',
  'a.b?.c.d?.e?.f',

  // handle computed properties
  'a?.[0]',
  'a?.c[0]',
  'a?.c?.[0]',
  'a?.["foo"]',
  'a?.c["foo"]',
  'a?.c?.["foo"]?.d',
  'a.c?.["foo"]?.d.e?.f',

  // optional calls set 1
  'a?.()',
  'a?.b?.()',
  'a?.b.c?.()',
  'a?.b.c?.(1,2,3,4)',
  'a?.b.c?.d.e?.()',
  'a?.b.c?.d.e?.().g()',

  // optional calls set 2
  'a?.()?.()',
  'a?.()?.a.b?.c',
  'a?.().a.k?.c',
  'a?.()?.(1)(2)(3)',
  'a?.()?.(1)[foo.bar]',
  'a?.()?.(1)?.(2)?.(3)',
  'a?.()?.(1)?.(2)?.(3)?.a.b?.()()',
  'a?.()?.(1)?.(2)?.(3)?.a["b"]?.()()',

  // optional calls set 3
  'a.b.c().d?.e?.()',
  'a.b.c().d?.e?.().f()?.()',
  'a.b.c()?.[d.e]?.["one"]()?.f()?.()',

  // starting expressions
  'a.b()?.().a',
  'a["foo"]?.();',
  'a["foo"]?.()?.()()',
  'a.b()?.()?.()',
  'a["foo"]()?.o()?.().k()?.c',
  'a().b()?.c',
  'a()?.b',
  '(a || b)?.c',
];

const TYPESCRIPT_SNAPSHOT_FILE = path.join(__dirname, 'typescript.snapshot.json');
let TYPESCRIPT_SHAPSHOTS;
function createTypeScriptSnapshots(cases: Array<string>) {
  TYPESCRIPT_SHAPSHOTS = {};
  for (const str of cases) {
    const compilerOptions: ts.CompilerOptions = {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
    };
    const code = ts.transpileModule(str, {
      compilerOptions,
      fileName: __filename,
    });
    let transpiled = code.outputText;
    // replace typescript _a with fusebox numbers
    let alphabet = ['-', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];

    transpiled = transpiled.replace(/_([a-z])/gm, (input) => {
      const varName = input.split('_')[1];
      return `_${alphabet.indexOf(varName)}_`;
    });

    const ast = parseJavascript(transpiled);
    TYPESCRIPT_SHAPSHOTS[str] = generate(ast, {});
  }
  writeFileSync(TYPESCRIPT_SNAPSHOT_FILE, JSON.stringify(TYPESCRIPT_SHAPSHOTS, null, 2));
}

if (!fileExists(TYPESCRIPT_SNAPSHOT_FILE)) {
  createTypeScriptSnapshots(cases);
} else {
  TYPESCRIPT_SHAPSHOTS = readJSONFile(TYPESCRIPT_SNAPSHOT_FILE);
}

describe('Optional chaining', () => {
  describe('Snapshot test', () => {
    for (const str of cases) {
      it(`Should handle ${str}`, () => {
        const res = testTranspile({ code: str });
        expect(res.code).toEqual(TYPESCRIPT_SHAPSHOTS[str]);
      });
    }
  });

  describe('Corner cases', () => {
    it('should handle asExpression', () => {
      const res = testTranspile({
        code: `
        (a as string)?.b?.c;
        a?.b?.c;
        `,
      });
      expect(res).toMatchSnapshot();
    });

    it('should await expression 1', () => {
      const res = testTranspile({
        code: `
        async function main(){
          await a?.b
        }
        `,
      });

      expect(res.code).toMatchSnapshot();
    });

    it('should await expression 2', () => {
      const res = testTranspile({
        code: `
        async function main(){
          await a?.b()
        }
        `,
      });

      expect(res.code).toMatchSnapshot();
    });

    it('should handle this expression', () => {
      const res = testTranspile({
        code: `this.a?.b`,
      });

      expect(res.code).toMatchSnapshot();
    });

    it('should handle not null expression', () => {
      const res = testTranspile({
        code: `a?.b!;`,
      });
      expect(res.code).toMatchSnapshot();
    });

    it('should await expression with ?? ', () => {
      const res = testTranspile({
        code: `
        let b = async (a, c) => {
          const b = await a?.a() ?? await c?.d;
        };
        `,
      });

      expect(res.code).toMatchSnapshot();
    });
  });
});
