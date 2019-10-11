import { renderProductionAPI } from '../renderProductionAPI';

describe('renderProductionAPI test', () => {
  it('should give browser', () => {
    const str = renderProductionAPI({ server: true });
    expect(str).toContain('$fsx.r');
  });
});
