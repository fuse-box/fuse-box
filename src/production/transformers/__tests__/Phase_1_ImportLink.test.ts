import { testProductionWarmup } from '../testUtils';
import { Phase_1_ImportLink } from '../Phase_1_ImportLink';

describe('Phase 1 Import link test', () => {
  function test(code: string) {
    return testProductionWarmup({ code, transformers: [Phase_1_ImportLink()] });
  }
  it('should work', () => {
    const { tree } = test(`import "./foo"`);
    expect(tree['stuff']).toEqual(true);
  });
});
