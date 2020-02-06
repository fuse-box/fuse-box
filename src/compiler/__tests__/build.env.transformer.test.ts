import { initCommonTransform } from '../testUtils';
import { BuildEnvTransformer } from '../transformers/bundle/BuildEnvTransformer';

describe('Build env transformer', () => {
  const testTranspile = (props: { buildEnv?: Record<string, any>; code: string }) => {
    return initCommonTransform({
      code: props.code,
      compilerOptions: {
        buildEnv: props.buildEnv,
      },

      transformers: [BuildEnvTransformer()],
    });
  };
  it('should replace a string', () => {
    const res = testTranspile({
      buildEnv: { foo: '"this is foo"' },
      code: `
        __build_env.foo;
    `,
    });

    expect(res.code).toContain(`"this is foo";`);
  });

  it('should throw an exception', () => {
    expect(() => {
      testTranspile({
        buildEnv: { foo: 'oi oi oi' },
        code: `
          __build_env.foo;
      `,
      });
    }).toThrowError();
  });

  it('should replace an array', () => {
    const res = testTranspile({
      buildEnv: { foo: [1, 2] },
      code: `__build_env.foo;`,
    });
    expect(res.code).toContain(`[1, 2];`);
  });

  it('should replace an object', () => {
    const res = testTranspile({
      buildEnv: { foo: { hello: 'world' } },
      code: `console.log(__build_env.foo)`,
    });
    expect(res.code).toContain(`"hello": "world"`);
  });

  it('should replace a nested object', () => {
    const res = testTranspile({
      buildEnv: { foo: { hello: { world: 'baz' } } },
      code: `console.log(__build_env.foo)`,
    });

    expect(res.code).toMatchInlineSnapshot(`
      "console.log({
        \\"hello\\": {
          \\"world\\": \\"baz\\"
        }
      });
      "
    `);
  });
});
