import { createContext } from '../../core/context';
import { EnvironmentType } from '../EnvironmentType';
import { IConfig, IPublicConfig } from '../IConfig';

describe('Config test', () => {
  function test(config: IPublicConfig): IConfig {
    const ctx = createContext({
      envType: EnvironmentType.DEVELOPMENT,
      publicConfig: { ...{ entry: __filename }, ...config },
      runProps: {},
    });
    return ctx.config;
  }

  describe('Depdndencies field', () => {
    it('should give default include field for browser', () => {
      const res = test({ target: 'browser' });
      expect(res.dependencies.include).toEqual([]);
    });

    it('should give default fields for server', () => {
      const res = test({ target: 'server' });
      expect(res.dependencies.serverIgnoreExternals).toEqual(true);
    });

    it('should override serverIgnoreExternals', () => {
      const res = test({ dependencies: { serverIgnoreExternals: false }, target: 'server' });
      expect(res.dependencies.serverIgnoreExternals).toEqual(false);
    });
  });
});
