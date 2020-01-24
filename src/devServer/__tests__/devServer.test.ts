import { BundleType, createBundle } from '../../bundle/bundle';
import { createContext } from '../../core/context';
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
      listen: __mock_expressListen,
      use: __mock_expressUse,
      all: () => {},
    };
  };

  fn.static = jest.fn();
  return fn;
});

describe('Dev server test', () => {
  it('should test', () => {});
  // beforeEach(() => {
  //   __mock_expressListen = jest.fn();
  //   __mock_expressUse = jest.fn();
  // });
  // it('Should inject fuse-box-hot-reload', () => {
  //   const data = mockModule({
  //     config: {
  //       devServer: true,
  //     },
  //     moduleProps: {},
  //     packageProps: { isDefaultPackage: true },
  //   });
  //   // data.pkg.entry = data.module;
  //   // data.module.analysis = { imports: [] };

  //   // data.ctx.ict.sync('assemble_after_transpile', { module: data.module });
  //   // expect(data.module.analysis.imports).toHaveLength(1);
  //   // expect(data.module.analysis.imports[0].literal).toEqual('fuse-box-hot-reload');
  // });

  // it('Should not inject fuse-box-hot-reload', () => {
  //   const data = mockModule({
  //     config: {
  //       devServer: true,
  //     },
  //     moduleProps: {},
  //     packageProps: { isDefaultPackage: false },
  //   });
  //   // data.pkg.entry = data.module;
  //   // data.module.analysis = { imports: [] };

  //   // data.ctx.ict.sync('assemble_after_transpile', { module: data.module });
  //   // expect(data.module.analysis.imports).toHaveLength(0);
  // });

  // it('Should inject code with hmr', () => {
  //   const data = mockModule({
  //     config: {
  //       devServer: true,
  //     },
  //     moduleProps: {},
  //     packageProps: { isDefaultPackage: true },
  //   });
  //   const bundle = createBundle({ ctx: data.ctx, name: 's', type: BundleType.PROJECT_JS });
  //   data.ctx.ict.sync('before_bundle_write', { bundle });
  //   expect(bundle.generate().contents).toEqual(`FuseBox.import("fuse-box-hot-reload").connect({"useCurrentURL":true})`);
  // });

  // it('Should not inject code with hmr', () => {
  //   const data = mockModule({
  //     config: {
  //       devServer: true,
  //     },
  //     moduleProps: {},
  //     packageProps: { isDefaultPackage: true },
  //   });
  //   const bundle = createBundle({ ctx: data.ctx, name: 's', type: BundleType.VENDOR_JS });
  //   data.ctx.ict.sync('before_bundle_write', { bundle });
  //   expect(bundle.generate().contents).not.toContain('fuse-box-hot-reload');
  // });

  // it('Should launch http server', () => {
  //   __mock_expressListen = jest.fn();
  //   const data = mockModule({
  //     config: {
  //       devServer: true,
  //       logging: { level: 'disabled' },
  //     },
  //     moduleProps: {},
  //     packageProps: { isDefaultPackage: false },
  //   });
  //   data.ctx.ict.sync('complete', { bundles: [], ctx: data.ctx });
  //   expect(__mock_expressListen).toHaveBeenCalled();
  // });

  // it('Should launch hmr server on different port', () => {
  //   const data = mockModule({
  //     config: {
  //       devServer: {
  //         httpServer: false,
  //       },
  //       logging: { level: 'disabled' },
  //     },
  //     moduleProps: {},
  //     packageProps: { isDefaultPackage: false },
  //   });
  //   data.ctx.ict.sync('complete', { bundles: [], ctx: data.ctx });
  // });

  // it('Should call onClientMessage', () => {
  //   const data = mockModule({
  //     config: {
  //       devServer: {
  //         httpServer: true,
  //       },
  //       logging: { level: 'disabled' },
  //     },
  //     moduleProps: {},
  //     packageProps: { isDefaultPackage: true },
  //   });
  //   data.ctx.ict.sync('complete', { bundles: [], ctx: data.ctx });
  //   data.ctx.devServer.clientSend('foo', {});
  // });

  // it('Should call clientSend', () => {
  //   const data = mockModule({
  //     config: {
  //       devServer: {
  //         httpServer: true,
  //       },
  //       logging: { level: 'disabled' },
  //     },
  //     moduleProps: {},
  //     packageProps: { isDefaultPackage: true },
  //   });
  //   data.ctx.ict.sync('complete', { bundles: [], ctx: data.ctx });
  //   data.ctx.devServer.onClientMessage((name, data) => {});
  // });

  // describe('Create express app', () => {
  //   it('should send a fallback file', () => {
  //     const fallback = 'fallback.html';
  //     __mock_expressListen = (port, fn) => {
  //       fn();
  //     };

  //     __mock_expressUse = (path: string, cb) => {
  //       if (path === '*') {
  //         cb(
  //           {},
  //           {
  //             sendFile: file => {
  //               expect(file).toEqual(fallback);
  //             },
  //           },
  //         );
  //       }
  //     };
  //     createExpressApp(createContext({}), { fallback: fallback, root: '/' });
  //   });
  // });
});
