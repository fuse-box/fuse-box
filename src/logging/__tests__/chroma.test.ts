import * as chroma from '../chroma';

describe('chroma', () => {
  for (const key in chroma.codes) {
    it(`should be ${key}`, () => {
      const code = chroma.codes[key];
      const escaped = JSON.stringify(chroma.colors[key]('__'));
      expect(escaped).toEqual(JSON.stringify(`\u001b[${code[0]}m__\u001b[${code[1]}m`));
    });
  }
});
