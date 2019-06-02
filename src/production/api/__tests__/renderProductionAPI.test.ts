import { renderProductionAPI } from '../renderProductionAPI';

describe('renderProductionAPI test', () => {
  it('should give browser', () => {
    const str = renderProductionAPI({ server: true });
    expect(str).toContain('$fsx.r');
  });

  it('should give code splitting', () => {
    const str = renderProductionAPI({ browser: true, ajaxRequired: true, codeSplitting: true });
    expect(str).toContain('function aj(url, cb)');
  });
});
