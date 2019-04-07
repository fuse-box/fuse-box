import { assembleContext } from '../assemble_context';
import { createContext } from '../Context';
import { createPackage } from '../Package';

function mockAssembleContext() {
  const ctx = createContext({});
  const fn = assembleContext(ctx);
  return {
    packages: fn.collection.packages,
    ctx: ctx,
  };
}
describe('assemble context test', () => {
  it('should not find', () => {
    const fn = mockAssembleContext();
    expect(fn.packages.get('foo', '1.0.0')).toBeUndefined();
  });

  it('should create and find with flat true', () => {
    const data = mockAssembleContext();
    const pkg = createPackage({ ctx: data.ctx, meta: { name: 'foo', version: '1.0.0' } });
    data.packages.add(pkg);

    const foundPackage = data.packages.get('foo', '1.0.0');
    expect(foundPackage).toBeTruthy();
    expect(foundPackage.isFlat).toEqual(true);
  });

  it('should create and find with flat flase', () => {
    const data = mockAssembleContext();
    const pkg1 = createPackage({ ctx: data.ctx, meta: { name: 'foo', version: '1.0.0' } });
    const pkg2 = createPackage({ ctx: data.ctx, meta: { name: 'foo', version: '2.0.0' } });
    data.packages.add(pkg1);
    data.packages.add(pkg2);

    expect(pkg1.isFlat).toEqual(true);
    expect(pkg2.isFlat).toEqual(false);
  });

  it('should flush context', () => {
    const data = mockAssembleContext();
    const pkg1 = createPackage({ ctx: data.ctx, meta: { name: 'foo', version: '1.0.0' } });
    const pkg2 = createPackage({ ctx: data.ctx, meta: { name: 'foo', version: '2.0.0' } });
    data.packages.add(pkg1);
    data.packages.add(pkg2);

    data.ctx.assembleContext.flush();

    expect(data.ctx.assembleContext.getPackageCollection().size).toEqual(0);
  });
});
