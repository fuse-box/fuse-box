import { ImportType } from '../interfaces/ImportType';

import { ITarget } from '../../config/ITarget';
import { initCommonTransform } from '../testUtils';
import { BrowserProcessTransformer } from '../transformers/bundle/BrowserProcessTransformer';

const testTranspile = (props: { code: string; env?: any; target?: ITarget }) => {
  return initCommonTransform({
    compilerOptions: {
      buildTarget: props.target || 'browser',
      processEnv: props.env || {},
    },
    props: {
      ctx: { config: { env: props.env || {}, target: props.target || 'browser' } },
    },

    code: props.code,
    transformers: [BrowserProcessTransformer()],
  });
};

describe('Process transform test', () => {
  describe('process.env.***', () => {
    it('should replace process.env.NODE_ENV', () => {
      const result = testTranspile({
        code: `
          console.log(process.env.NODE_ENV);
      `,
        env: { NODE_ENV: 'development' },
        target: 'browser',
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should replace with undefined if value not found', () => {
      const result = testTranspile({
        code: `
          console.log(process.env.NODE_ENV);
      `,
        env: {},
        target: 'browser',
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
        env: { foo: 'bar' },
        target: 'browser',
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform process.env (not add twice)', () => {
      const result = testTranspile({
        code: `
        alert(process.env)
        console.log(process.env);
        `,
        env: { foo: 'bar' },
        target: 'browser',
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
            arguments: [{ type: 'Literal', value: 'process' }],
            callee: { name: 'require', type: 'Identifier' },
            type: 'CallExpression',
          },
        },
      ]);
      expect(result.code).toMatchSnapshot();
    });
  });
});
