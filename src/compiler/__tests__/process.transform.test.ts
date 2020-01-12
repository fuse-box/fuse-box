import { ImportType } from '../interfaces/ImportType';

import { initCommonTransform } from '../testUtils';
import { BrowserProcessTransformer } from '../transformers/bundle/BrowserProcessTransformer';

const testTranspile = (props: { code: string; target?: string; env?: any }) => {
  return initCommonTransform({
    props: {
      ctx: { config: { env: props.env || {}, target: props.target || 'browser' } },
    },
    transformers: [BrowserProcessTransformer()],
    code: props.code,
  });
};

describe('Process transform test', () => {
  describe('process.env.***', () => {
    it('should replace process.env.NODE_ENV', () => {
      const result = testTranspile({
        target: 'browser',
        env: { NODE_ENV: 'development' },
        code: `
          console.log(process.env.NODE_ENV);
      `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should replace with undefined if value not found', () => {
      const result = testTranspile({
        target: 'browser',
        env: {},
        code: `
          console.log(process.env.NODE_ENV);
      `,
      });
      expect(result.code).toMatchSnapshot();
    });
  });

  describe('Should not touch process', () => {
    it('should transform process.version', () => {
      const result = testTranspile({
        code: `
          var process = {};
          console.log(process.version);
      `,
      });

      expect(result.code).toMatchSnapshot();
    });

    it('should inject process on assignment', () => {
      const result = testTranspile({
        code: `
          process.env.NODE_ENV = "hey";

      `,
      });

      expect(result.code).toMatchSnapshot();
    });
  });
  describe('process.xxx', () => {
    it('should transform process.version', () => {
      const result = testTranspile({
        code: `
          console.log(process.version);
      `,
      });

      expect(result.code).toMatch(/console.log\("v\d+/);
    });

    it('should transform process.versions', () => {
      const result = testTranspile({
        code: `console.log(process.versions);`,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform process.title', () => {
      const result = testTranspile({
        code: `console.log(process.title);`,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform process.umask', () => {
      const result = testTranspile({
        code: `console.log(process.umask);`,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform process.browser', () => {
      const result = testTranspile({
        code: `console.log(process.browser);`,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform process.cwd', () => {
      const result = testTranspile({
        code: `console.log(process.cwd());`,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform process.env', () => {
      const result = testTranspile({
        code: `console.log(process.env);`,
        target: 'browser',
        env: { foo: 'bar' },
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform process.env (not add twice)', () => {
      const result = testTranspile({
        code: `
        alert(process.env)
        console.log(process.env);
        `,
        target: 'browser',
        env: { foo: 'bar' },
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should inject process if a variable is not recognized', () => {
      const result = testTranspile({
        code: `
        console.log(process.some());
        `,
      });

      expect(result.requireStatementCollection).toEqual([
        {
          importType: ImportType.REQUIRE,
          statement: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'require' },
            arguments: [{ type: 'Literal', value: 'process' }],
          },
        },
      ]);
      expect(result.code).toMatchSnapshot();
    });
  });
});
