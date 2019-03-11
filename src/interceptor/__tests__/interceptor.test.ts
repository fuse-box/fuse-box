import { createInterceptor } from '../interceptor';
import { createModule, Module } from '../../core/Module';
import { Context, createContext } from '../../core/context';
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
});
