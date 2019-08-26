import { codes } from '../chroma';
import { codeLog } from '../codeLog';

describe('code log test', () => {
  for (const name in codes) {
    it(`should render ${name}`, () => {
      const result = JSON.stringify(`\u001b[${codes[name][0]}mtext\u001b[${codes[name][1]}m`);
      expect(JSON.stringify(codeLog(`<${name}>text</${name}>`))).toEqual(result);
    });
  }
});
