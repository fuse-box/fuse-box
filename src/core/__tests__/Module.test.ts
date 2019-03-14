import { createContext } from '../Context';
import { createModule } from '../Module';
import { createPackage } from '../Package';

describe('Module test', () => {
  const ctx = createContext({});
  it('should module be entry', () => {
    const pkg = createPackage({ ctx: ctx, meta: { name: 'foo' } });
    const module = createModule(
      {
        absPath: '/',
        ctx: ctx,
        extension: '.js',
        fuseBoxPath: '/',
      },
      pkg,
    );
    pkg.setEntry(module);
    expect(module.isEntry()).toEqual(true);
  });
});
