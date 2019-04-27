import * as path from 'path';
import { IPublicConfig } from '../../config/IPublicConfig';
import { Context, createContext } from '../../core/Context';
import { Package } from '../../core/Package';
import { assemble } from '../assemble';

function createProjectContext(folder: string, opts?: IPublicConfig) {
  opts = opts || {};
  return createContext({
    ...{
      modules: [path.resolve(__dirname, 'cases/modules/')],
      homeDir: path.resolve(__dirname, 'cases/projects/', folder),
    },
    ...opts,
  });
}

// async function resolve(folder: string, opts: IPublicConfig, entry: string): Promise<Array<Package>> {
//   const ctx = createProjectContext(folder, opts);
//   const packages = assemble(ctx, entry);
//   await attachPlugins({ ctx: ctx, packages: packages, plugins: opts.plugins });
//   return packages;
// }

describe('Processing modules', () => {
  it('should', () => {});
  // it('should trigger bundle_resolve_start', async () => {
  //   const fn = jest.fn();
  //   const fn2 = jest.fn();
  //   await resolve(
  //     'resolve_1',
  //     {
  //       plugins: [
  //         (ctx: Context) => {
  //           ctx.ict.on('bundle_resolve_start', fn);
  //           ctx.ict.on('bundle_resolve_module', fn2);
  //         },
  //       ],
  //     },
  //     'index.ts',
  //   );
  //   expect(fn).toHaveBeenCalledTimes(1);
  //   expect(fn2).toHaveBeenCalledTimes(1);
  // });

  // it('should trigger resolve typescript module', async () => {
  //   const fn = jest.fn();
  //   const fn2 = jest.fn();
  //   await resolve(
  //     'resolve_1',
  //     {
  //       plugins: [
  //         (ctx: Context) => {
  //           ctx.ict.on('bundle_resolve_typescript_module', fn);
  //           ctx.ict.on('bundle_resolve_module', fn2);
  //         },
  //       ],
  //     },
  //     'index.ts',
  //   );
  //   expect(fn).toHaveBeenCalledTimes(1);
  //   expect(fn2).toHaveBeenCalledTimes(1);
  // });
  // it('should trigger resolve typescript module 2 times', async () => {
  //   const fn = jest.fn();
  //   const fn2 = jest.fn();
  //   await resolve(
  //     'resolve_1',
  //     {
  //       plugins: [
  //         (ctx: Context) => {
  //           ctx.ict.on('bundle_resolve_typescript_module', fn);
  //           ctx.ict.on('bundle_resolve_module', fn2);
  //         },
  //       ],
  //     },
  //     'index2.ts',
  //   );
  //   expect(fn).toHaveBeenCalledTimes(2);
  //   expect(fn2).toHaveBeenCalledTimes(2);
  // });

  // it('should trigger resolve js module', async () => {
  //   const fn = jest.fn();
  //   const fn2 = jest.fn();
  //   await resolve(
  //     'resolve_1',
  //     {
  //       plugins: [
  //         (ctx: Context) => {
  //           ctx.ict.on('bundle_resolve_js_module', fn);
  //           ctx.ict.on('bundle_resolve_module', fn2);
  //         },
  //       ],
  //     },
  //     'index.js',
  //   );
  //   expect(fn).toHaveBeenCalledTimes(1);
  //   expect(fn2).toHaveBeenCalledTimes(1);
  // });

  // it('should trigger resolve js module 2 times', async () => {
  //   const fn = jest.fn();
  //   const fn2 = jest.fn();
  //   await resolve(
  //     'resolve_1',
  //     {
  //       plugins: [
  //         (ctx: Context) => {
  //           ctx.ict.on('bundle_resolve_js_module', fn);
  //           ctx.ict.on('bundle_resolve_module', fn2);
  //         },
  //       ],
  //     },
  //     'index2.js',
  //   );
  //   expect(fn).toHaveBeenCalledTimes(2);
  //   expect(fn2).toHaveBeenCalledTimes(2);
  // });

  // it('should trigger after a plugin has resolved itself', async () => {
  //   let result;
  //   await resolve(
  //     'resolve_1',
  //     {
  //       plugins: [
  //         (ctx: Context) => {
  //           ctx.ict.promise(() => {
  //             return new Promise((resolve, reject) => {
  //               setTimeout(() => {
  //                 result = 'done';
  //                 return resolve();
  //               }, 10);
  //             });
  //           });
  //         },
  //       ],
  //     },
  //     'index.ts',
  //   );
  //   expect(result).toEqual('done');
  // });

  // it('should not process a cached package', async () => {
  //   let result;
  //   const ctx = createProjectContext('resolve_1', {});
  //   const packages = assemble(ctx, 'index.ts');

  //   packages.map(pkg => {
  //     pkg.isCached = true;
  //   });
  //   let shouldBeFalse = false;
  //   await attachPlugins({
  //     ctx: ctx,
  //     packages: packages,
  //     plugins: [
  //       (ctx: Context) => {
  //         ctx.ict.on('bundle_resolve_module', props => {
  //           shouldBeFalse = true;
  //           return props;
  //         });
  //       },
  //     ],
  //   });
  //   expect(shouldBeFalse).toBe(false);
  // });

  // it('should not process a cached module', async () => {
  //   const ctx = createProjectContext('resolve_1', {});
  //   const packages = assemble(ctx, 'index.ts');

  //   packages.map(pkg => {
  //     pkg.modules.forEach(mod => {
  //       mod.isCached = true;
  //     });
  //   });
  //   let shouldBeFalse = false;
  //   await attachPlugins({
  //     ctx: ctx,
  //     packages: packages,
  //     plugins: [
  //       (ctx: Context) => {
  //         ctx.ict.on('bundle_resolve_module', props => {
  //           shouldBeFalse = true;
  //           return props;
  //         });
  //       },
  //     ],
  //   });
  //   expect(shouldBeFalse).toBe(false);
  // });
});
