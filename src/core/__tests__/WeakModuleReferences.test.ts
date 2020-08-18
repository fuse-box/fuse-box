import { createTestContext } from '../../utils/test_utils';
import { WeakModuleReferences, createWeakModuleReferences } from '../WeakModuleReferences';
import { createContext } from '../context';

describe('WeakModuleReferences', () => {
  function create(): WeakModuleReferences {
    const ctx = createTestContext();
    return createWeakModuleReferences(ctx);
  }
  it('should be 0 at start', () => {
    const ref = create();
    expect(Object.keys(ref.collection)).toHaveLength(0);
  });

  it('should add one ref', () => {
    const ref = create();
    ref.add('/foo', '/bar');
    expect(Object.keys(ref.collection)).toHaveLength(1);
  });

  it('should not add the same ref', () => {
    const ref = create();
    ref.add('/foo', '/bar');
    ref.add('/foo', '/bar');
    expect(Object.keys(ref.collection)).toHaveLength(1);
  });

  it('should flush', () => {
    const ref = create();
    ref.add('/foo', '/bar');
    ref.add('/foo', '/bar');
    ref.flush();
    expect(Object.keys(ref.collection)).toHaveLength(0);
  });

  it('should find', () => {
    const ref = create();
    ref.add('/foo', '/bar');
    const res = ref.find('/foo');
    expect(res).toEqual(['/bar']);
  });
});
