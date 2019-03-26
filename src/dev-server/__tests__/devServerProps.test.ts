import { IConfig } from '../../core/interfaces';
import { createConfig } from '../../core/config';
import { createDevServerConfig } from '../devServerProps';
import { createContext } from '../../core/Context';
import '../../utils/test_utils';
function configure(config?: IConfig) {
  const ctx = createContext(createConfig(config));
  return createDevServerConfig(ctx);
}

describe('devServerProps test', () => {
  it('should be disabled 1', () => {
    const data = configure({});
    expect(data).toEqual({ enabled: false });
  });

  it('should be disabled 2', () => {
    const data = configure({ devServer: false });
    expect(data).toEqual({ enabled: false });
  });

  function defaultCheck(data) {
    expect(data.httpServer['enabled']).toEqual(true);
    expect(data.httpServer['fallback']).toMatchFilePath('dist/index.html$');
    expect(data.httpServer['root']).toMatchFilePath('__tests__/dist$');
    expect(data.hmrServer['enabled']).toEqual(true);
    expect(data.hmrServer['port']).toEqual(4444);
  }

  it('should be enabled', () => {
    const data = configure({ devServer: true });
    defaultCheck(data);
  });

  it('should be enabled with invalid args', () => {
    const opts: any = { devServer: 1 };
    const data = configure(opts);
    defaultCheck(data);
  });

  it('should be enabled with hmrServer true', () => {
    const data = configure({ devServer: { hmrServer: true } });
    defaultCheck(data);
  });

  it('should be enabled with hmrServer {}', () => {
    const data = configure({ devServer: { hmrServer: {} } });
    defaultCheck(data);
  });

  it('should be enabled with httpServer true', () => {
    const data = configure({ devServer: { hmrServer: true } });
    defaultCheck(data);
  });

  it('should be enabled with httpServer {}', () => {
    const data = configure({ devServer: { hmrServer: {} } });
    defaultCheck(data);
  });

  it('httpServer disabled', () => {
    const data = configure({ devServer: { httpServer: false } });
    expect(data.httpServer['enabled']).toEqual(false);
  });

  it('hmrServer disabled', () => {
    const data = configure({ devServer: { hmrServer: false } });
    expect(data.hmrServer['enabled']).toEqual(false);
  });

  it('should have http port', () => {
    const data = configure({ devServer: { httpServer: { port: 1 } } });
    expect(data.httpServer['port']).toEqual(1);
  });

  it('should have the same hmr port', () => {
    const data = configure({ devServer: { httpServer: { port: 1 } } });
    expect(data.httpServer['port']).toEqual(1);
    expect(data.hmrServer['port']).toEqual(1);
  });

  it('should have a different port', () => {
    const data = configure({ devServer: { hmrServer: { port: 2 } } });
    expect(data.httpServer['port']).toEqual(4444);
    expect(data.hmrServer['port']).toEqual(2);
  });

  it('should http disabled but hmr enabled', () => {
    const data = configure({ devServer: { httpServer: false, hmrServer: { port: 2 } } });
    expect(data.httpServer['enabled']).toEqual(false);
    expect(data.hmrServer['port']).toEqual(2);
  });

  it('should have root set', () => {
    const data = configure({ devServer: { httpServer: { root: '/' } } });
    expect(data.httpServer['root']).toEqual('/');
  });

  it('should have fallback set', () => {
    const data = configure({ devServer: { httpServer: { fallback: 'foo.html' } } });
    expect(data.httpServer['fallback']).toEqual('foo.html');
  });

  it('should have it disabled when server', () => {
    const data = configure({ target: 'server', devServer: true });
    expect(data.hmrServer['enabled']).toEqual(false);
  });

  it('should have it disabled when production', () => {
    const data = configure({ production: {}, devServer: true });
    expect(data.hmrServer['enabled']).toEqual(false);
  });
});
