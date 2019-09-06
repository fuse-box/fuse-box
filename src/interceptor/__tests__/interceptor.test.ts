import { createInterceptor } from '../interceptor';
import { createModule, Module } from '../../core/Module';
import { Context, createContext } from '../../core/Context';
import { createDefaultPackage } from '../../core/application';

describe('Interceptor', () => {
  let _module: Module;
  let ctx: Context;
  beforeEach(() => {
    ctx = createContext({});
    const pkg = createDefaultPackage(ctx);
    _module = createModule({ ctx: ctx, absPath: '/', extension: '.js', fuseBoxPath: '/' }, pkg);
  });
  it('Should create an interceptor', () => {
    const interceptor = createInterceptor();
    expect(typeof interceptor.on).toBe('function');
    expect(typeof interceptor.sync).toBe('function');
  });

  it('return the same props without any subscriptions', () => {
    const interceptor = createInterceptor();
    const props = { foo: '123' };
    const response = interceptor.sync('test', props);
    expect(response).toEqual(props);
  });

  it('Intercept module', () => {
    const interceptor = createInterceptor();
    interceptor.on('assemble_module', (props: { module: Module }) => {
      props.module.contents = 'foo';
      return props;
    });
    const response = interceptor.sync('assemble_module', { module: _module });
    expect(response.module.contents).toEqual('foo');
  });

  it('should subscribe 2 times', () => {
    const interceptor = createInterceptor();
    interceptor.on('assemble_module', (props: { module: Module }) => {
      props.module.contents = 'foo';
      return props;
    });
    interceptor.on('assemble_module', (props: { module: Module }) => {
      props.module.contents = 'bar';
      return props;
    });
    const response = interceptor.sync('assemble_module', { module: _module });
    expect(response.module.contents).toEqual('bar');
  });

  it('should promise and resolve', async () => {
    const icp = createInterceptor();
    const responses = [];
    icp.promise(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          responses.push(1);
          return resolve();
        }, 1);
      });
    });
    icp.promise(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          responses.push(2);
          return resolve();
        }, 2);
      });
    });
    await icp.resolve();
    expect(responses).toEqual([1, 2]);
  });

  it('should await all interceptors to finish', async () => {
    const interceptor = createInterceptor();

    interceptor.awaitOn('assemble_module', async (props: { module: Module }) => {
      const sleep = async (sec: number) => {
        return new Promise(resolve => setTimeout(resolve, sec * 1000));
      };

      await sleep(2);

      props.module.contents = 'foo';
      return props;
    });

    const timeNow = Date.now();
    const response = await interceptor.awaitForSync('assemble_module', { module: _module });

    expect(Date.now() - timeNow).toBeGreaterThan(2000);
    expect(response.module.contents).toEqual('foo');
  });

  it('should be backwards compatible with non-async callbacks', async () => {
    const interceptor = createInterceptor();

    interceptor.on('assemble_module', (props: { module: Module }) => {
      props.module.contents = 'foo';
      return props;
    });

    const response = await interceptor.awaitForSync('assemble_module', { module: _module });

    expect(response.module.contents).toEqual('foo');
  });

  it('should NOT be be forward compatible with async callbacks', () => {
    const interceptor = createInterceptor();

    interceptor.awaitOn('assemble_module', async (props: { module: Module }) => {
      props.module.contents = 'foo';
      return props;
    });

    const response = interceptor.sync('assemble_module', { module: _module });

    expect(response).toBeInstanceOf(Promise);
    expect(response.module).not.toBeDefined();
  });
});
