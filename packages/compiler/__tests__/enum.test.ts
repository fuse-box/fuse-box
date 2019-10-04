import { testTranspile } from '../transpilers/testTranpiler';

describe('Enums test', () => {
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
});
