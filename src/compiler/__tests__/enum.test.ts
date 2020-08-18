import { initCommonTransform } from '../testUtils';
import { EnumTransformer } from '../transformers/ts/EnumTransformer';

describe('Enums test', () => {
  const testTranspile = (props: { code: string; jsx?: boolean }) => {
    return initCommonTransform({
      jsx: props.jsx,
      transformers: [EnumTransformer()],
      code: props.code,
    });
  };

  it('should work with a simple enum', () => {
    const result = testTranspile({
      code: `
        enum Stuff {
          first,
          second,
        }
    `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should work with a custom numner enum', () => {
    const result = testTranspile({
      code: `
        enum Stuff {
          first,
          second = 30,
        }
    `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should compute binary', () => {
    const result = testTranspile({
      code: `
        enum Stuff {
          first,
          second = 1 << 2,
        }
    `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should compute binary and do some math', () => {
    const result = testTranspile({
      code: `
        enum Stuff {
          first,
          second = 1 << 2 + 10 - 30 * (2 / 10),
        }
    `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should compute binary and do some math with Math.function', () => {
    const result = testTranspile({
      code: `
        enum Stuff {
          first,
          second = 1 << 2 + 10 - 30 * Math.sin(2 / 3),
        }
    `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should compute crazy enum and reference is in another enum', () => {
    const result = testTranspile({
      code: `
        enum Stuff {
          First = 1 << 1,
          Second = 1 << (2 + 10 - 30 * Math.sin(2 / 3)),
          Third = (((Second / 2) * 3) / First) * 2,
        }
    `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should respect local enum references if not able to compute', () => {
    const result = testTranspile({
      code: `
        enum Stuff {
          First = 1 << 1,
          Second = Hey + 1 + First,
        }
    `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should respect string value 1', () => {
    const result = testTranspile({
      code: `
        enum Stuff {
          'foo'
        }
    `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should respect string value 2', () => {
    const result = testTranspile({
      code: `
        enum Stuff {
          'foo' = 'bar'
        }
    `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should convert to sting if defined', () => {
    const result = testTranspile({
      code: `
        enum Stuff {
          foo = 'bar'
        }
    `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should be able to handle numbers', () => {
    const result = testTranspile({
      code: `
        enum Stuff {
          foo = 1
        }
    `,
    });
    expect(result.code).toMatchSnapshot();
  });
});
