import { mockWriteFile } from '../../utils/test_utils';
const fileMock = mockWriteFile();

import { createContext } from '../../core/Context';
import { IConfig } from '../../core/interfaces';
import { BundleType, createBundleSet, Bundle } from '../Bundle';

//jest.mock()
function mockBundle(props: { config?: IConfig; type: BundleType }) {
  const ctx = createContext(props.config);
  const bundleSet = createBundleSet(ctx);
  const bundle = bundleSet.getBundle(props.type);
  return {
    bundle,
  };
}
describe('Bundle test', () => {
  beforeEach(async () => await fileMock.flush());
  afterAll(() => {
    fileMock.unmock();
  });

  it('should write both files (css)', async () => {
    const data = mockBundle({
      config: {},
      type: BundleType.CSS,
    });
    const generated = data.bundle.generate();
    await generated.write();
    expect(fileMock.getFileAmount()).toBe(2);
  });

  it('should not write maps (css)', async () => {
    const data = mockBundle({
      config: {
        sourceMap: { css: false },
      },
      type: BundleType.CSS,
    });
    const generated = data.bundle.generate();
    await generated.write();

    expect(fileMock.getFileAmount()).toBe(1);
  });

  it('should write project with sm', async () => {
    const data = mockBundle({
      config: {
        sourceMap: {},
      },
      type: BundleType.PROJECT_JS,
    });
    const generated = data.bundle.generate();
    await generated.write();
    expect(fileMock.getFileAmount()).toBe(2);
  });

  it('should write project without sm', async () => {
    const data = mockBundle({
      config: {
        sourceMap: { project: false },
      },
      type: BundleType.PROJECT_JS,
    });
    const generated = data.bundle.generate();
    await generated.write();
    expect(fileMock.getFileAmount()).toBe(1);
  });

  it('should write vendor with sm', async () => {
    const data = mockBundle({
      config: {
        sourceMap: { vendor: true },
      },
      type: BundleType.VENDOR_JS,
    });
    const generated = data.bundle.generate();
    await generated.write();
    expect(fileMock.getFileAmount()).toBe(2);
  });

  it('should write project vendor sm', async () => {
    const data = mockBundle({
      config: {
        sourceMap: { vendor: false },
      },
      type: BundleType.VENDOR_JS,
    });
    const generated = data.bundle.generate();
    await generated.write();
    expect(fileMock.getFileAmount()).toBe(1);
  });

  it('should not write dev packages', async () => {
    const data = mockBundle({
      config: {
        sourceMap: {},
      },
      type: BundleType.DEV,
    });
    const generated = data.bundle.generate();
    await generated.write();
    expect(fileMock.getFileAmount()).toBe(1);
  });
});
