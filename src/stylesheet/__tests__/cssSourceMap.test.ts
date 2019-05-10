import { mockModule } from '../../utils/test_utils';
import { alignCSSSourceMap } from '../cssSourceMap';
import * as path from 'path';
import { env } from '../../env';
describe('css source map test', () => {
  function mockSources(list: Array<string>) {
    const json = { sources: list };
    return new Buffer(JSON.stringify(json));
  }
  it('should not parse if not valid', () => {
    const { ctx, pkg, module } = mockModule({
      config: { homeDir: __dirname },
      moduleProps: { absPath: path.join(__dirname, 'index.ts') },
    });
    pkg.isDefaultPackage = true;
    const res = alignCSSSourceMap({ ctx, module, sourceMap: new Buffer('{}') });

    expect(JSON.parse(res)).toEqual({});
  });

  it('should parse default package source', () => {
    const { ctx, pkg, module } = mockModule({
      config: { homeDir: __dirname },
      moduleProps: { absPath: path.join(__dirname, 'index.ts') },
    });
    pkg.isDefaultPackage = true;
    const res = alignCSSSourceMap({ ctx, module, sourceMap: mockSources(['foo.scss']) });

    expect(JSON.parse(res)).toEqual({ sources: ['/src/foo.scss'] });
  });

  it('should parse node_module', () => {
    const { ctx, pkg, module } = mockModule({
      config: { homeDir: __dirname },
      moduleProps: { absPath: path.join(env.APP_ROOT, 'node_modules/foobar', 'index.ts') },
    });
    pkg.isDefaultPackage = false;
    pkg.props.meta.name = 'foobar';
    pkg.props.meta.version = '1.0.0';
    pkg.isFlat = true;
    pkg.props.meta.packageRoot = path.join(env.APP_ROOT, 'node_modules/foobar');
    const res = alignCSSSourceMap({ ctx, module, sourceMap: mockSources(['foo.scss']) });

    expect(JSON.parse(res)).toEqual({ sources: ['/modules/foobar/foo.scss'] });
  });
});
