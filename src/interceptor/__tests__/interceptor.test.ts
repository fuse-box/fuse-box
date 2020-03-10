import { Context, createContext } from '../../core/context';

import { IModule } from '../../moduleResolver/module';
import { createTestContext } from '../../utils/test_utils';
import { createInterceptor } from '../interceptor';

describe('Interceptor', () => {
  let _module: IModule;
  let ctx: Context;
  beforeEach(() => {
    ctx = createTestContext();
    _module = { absPath: '/', ctx: ctx, extension: '.js' };
  });
  it('Should create an interceptor', () => {
    const interceptor = createInterceptor();
    expect(typeof interceptor.on).toBe('function');
    expect(typeof interceptor.sync).toBe('function');
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
});
