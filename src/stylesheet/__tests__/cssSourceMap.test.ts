import * as path from 'path';
import { env } from '../../env';
import { mockModule } from '../../utils/test_utils';
import { alignCSSSourceMap } from '../cssSourceMap';
describe('css source map test', () => {
  function mockSources(list: Array<string>) {
    const json = { sources: list };
    return new Buffer(JSON.stringify(json));
  }
  it('should not parse if not valid', () => {
    const { ctx, module } = mockModule({
      config: { homeDir: __dirname },
      moduleProps: { absPath: path.join(__dirname, 'index.ts') },
      packageProps: { isDefaultPackage: true },
    });

    const res = alignCSSSourceMap({ ctx, module, sourceMap: new Buffer('{}') });

    expect(JSON.parse(res)).toEqual({});
  });

  it('should parse default package source', () => {
    const { ctx, module } = mockModule({
      config: { homeDir: __dirname },
      moduleProps: { absPath: path.join(__dirname, 'index.ts') },
      packageProps: { isDefaultPackage: true },
    });

    const res = alignCSSSourceMap({ ctx, module, sourceMap: mockSources(['foo.scss']) });

    expect(JSON.parse(res)).toEqual({ sources: ['src/stylesheet/__tests__/foo.scss'] });
  });

  it('should parse node_module', () => {
    const { ctx, module, pkg } = mockModule({
      config: { homeDir: __dirname },
      moduleProps: { absPath: path.join(env.APP_ROOT, 'node_modules/foobar', 'index.ts') },
      packageProps: { isDefaultPackage: false },
    });

    pkg.meta.name = 'foobar';
    pkg.meta.version = '1.0.0';
    pkg.meta.packageRoot = path.join(env.APP_ROOT, 'node_modules/foobar');
    const res = alignCSSSourceMap({ ctx, module, sourceMap: mockSources(['foo.scss']) });

    expect(JSON.parse(res)).toEqual({ sources: ['node_modules/foobar/foo.scss'] });
  });
});
