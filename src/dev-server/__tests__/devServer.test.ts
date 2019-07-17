import { BundleType, createBundle } from '../../bundle/Bundle';
import { createContext } from '../../core/Context';
import { mockModule } from '../../utils/test_utils';
import { createExpressApp } from '../devServer';

let __mock_expressListen;
let __mock_expressUse;

jest.mock('http', () => {
  return {
    createServer: jest.fn(),
  };
});

jest.mock('ws', () => {
  return {
    Server: class {
      on() {}
    },
  };
});

jest.mock('express', () => {
  const fn = () => {
    return {
      all: () => {},
      use: __mock_expressUse,
      listen: __mock_expressListen,
    };
  };

  fn.static = jest.fn();
  return fn;
});

describe('Dev server test', () => {
  beforeEach(() => {
    __mock_expressListen = jest.fn();
    __mock_expressUse = jest.fn();
  });
  it('Should inject fuse-box-hot-reload', () => {
    const data = mockModule({
      config: {
        devServer: true,
      },
      moduleProps: {},
      packageProps: { isDefaultPackage: true },
    });
    data.pkg.entry = data.module;
    data.module.fastAnalysis = { imports: [] };

    data.ctx.ict.sync('assemble_fast_analysis', { module: data.module });
    expect(data.module.fastAnalysis.imports).toHaveLength(1);
    expect(data.module.fastAnalysis.imports[0].statement).toEqual('fuse-box-hot-reload');
  });

  it('Should not inject fuse-box-hot-reload', () => {
    const data = mockModule({
      config: {
        devServer: true,
      },
      moduleProps: {},
      packageProps: { isDefaultPackage: false },
    });
    data.pkg.entry = data.module;
    data.module.fastAnalysis = { imports: [] };

    data.ctx.ict.sync('assemble_fast_analysis', { module: data.module });
    expect(data.module.fastAnalysis.imports).toHaveLength(0);
  });

  it('Should inject code with hmr', () => {
    const data = mockModule({
      config: {
        devServer: true,
      },
      moduleProps: {},
      packageProps: { isDefaultPackage: true },
    });
    const bundle = createBundle({ ctx: data.ctx, name: 's', type: BundleType.PROJECT_JS });
    data.ctx.ict.sync('before_bundle_write', { bundle });
    expect(bundle.generate().contents).toEqual(`FuseBox.import("fuse-box-hot-reload").connect({"port":4444})`);
  });

  it('Should not inject code with hmr', () => {
    const data = mockModule({
      config: {
        devServer: true,
      },
      moduleProps: {},
      packageProps: { isDefaultPackage: true },
    });
    const bundle = createBundle({ ctx: data.ctx, name: 's', type: BundleType.VENDOR_JS });
    data.ctx.ict.sync('before_bundle_write', { bundle });
    expect(bundle.generate().contents).not.toContain('fuse-box-hot-reload');
  });

  it('Should launch http server', () => {
    __mock_expressListen = jest.fn();
    const data = mockModule({
      config: {
        logging: { level: 'disabled' },
        devServer: true,
      },
      moduleProps: {},
      packageProps: { isDefaultPackage: false },
    });
    data.ctx.ict.sync('complete', { ctx: data.ctx, bundles: [] });
    expect(__mock_expressListen).toHaveBeenCalled();
  });

  it('Should launch hmr server on different port', () => {
    const data = mockModule({
      config: {
        logging: { level: 'disabled' },
        devServer: {
          httpServer: false,
        },
      },
      moduleProps: {},
      packageProps: { isDefaultPackage: false },
    });
    data.ctx.ict.sync('complete', { ctx: data.ctx, bundles: [] });
  });

  it('Should call onClientMessage', () => {
    const data = mockModule({
      config: {
        logging: { level: 'disabled' },
        devServer: {
          httpServer: true,
        },
      },
      moduleProps: {},
      packageProps: { isDefaultPackage: true },
    });
    data.ctx.ict.sync('complete', { ctx: data.ctx, bundles: [] });
    data.ctx.devServer.clientSend('foo', {});
  });

  it('Should call clientSend', () => {
    const data = mockModule({
      config: {
        logging: { level: 'disabled' },
        devServer: {
          httpServer: true,
        },
      },
      moduleProps: {},
      packageProps: { isDefaultPackage: true },
    });
    data.ctx.ict.sync('complete', { ctx: data.ctx, bundles: [] });
    data.ctx.devServer.onClientMessage((name, data) => {});
  });

  describe('Create express app', () => {
    it('should send a fallback file', () => {
      const fallback = 'fallback.html';
      __mock_expressListen = (port, fn) => {
        fn();
      };

      __mock_expressUse = (path: string, cb) => {
        if (path === '*') {
          cb(
            {},
            {
              sendFile: file => {
                expect(file).toEqual(fallback);
              },
            },
          );
        }
      };
      createExpressApp(createContext({}), { fallback: fallback, root: '/' });
    });
  });
});
