import { mockModule } from '../../utils/test_utils';
import { join } from 'path';
import { fixModuleSourceMap } from '../helpers';

describe('sourcemaps halpers ', () => {
  describe('fixModuleSourceMap', () => {
    const rawMap = `
    {"version":3,"sources":["somewrongpath"],"names":[],"mappings":";;AASA,OAAO,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC","file":"app","sourcesContent":["$fsmp$('foo')"]}
    `;

    it('should generate case 1', () => {
      const data = mockModule({
        packageProps: { isDefaultPackage: true },
        config: {
          homeDir: __dirname,
        },
      });
      data.module.props.absPath = join(__dirname, 'foobar.ts');
      data.module.props.fuseBoxPath = 'foobar.js';
      data.module.props.extension = '.ts';
      data.module.fastAnalysis = {
        report: {},
      };
      const fixedmap = fixModuleSourceMap(data.module, rawMap);
      const newMap = JSON.parse(fixedmap);
      expect(newMap.sources).toEqual(['/foobar.ts']);
      expect(newMap.sourcesContent).toEqual(["$fsmp$('foo')"]);
    });

    it('should fix $fsmp$ case', () => {
      const data = mockModule({
        packageProps: { isDefaultPackage: true },
        config: {
          homeDir: __dirname,
        },
      });
      data.module.props.absPath = join(__dirname, 'foobar.ts');
      data.module.props.fuseBoxPath = 'foobar.js';
      data.module.props.extension = '.ts';
      data.module.fastAnalysis = {
        report: {
          dynamicImports: true,
        },
      };
      const fixedmap = fixModuleSourceMap(data.module, rawMap);
      const newMap = JSON.parse(fixedmap);
      expect(newMap.sources).toEqual(['/foobar.ts']);
      expect(newMap.sourcesContent).toEqual(["import('foo')"]);
    });
  });
});
