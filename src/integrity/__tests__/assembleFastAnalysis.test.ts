import { createContext } from '../../core/__Context';
import { ImportType } from '../../resolver/resolver';
import { mockDefaultModule } from '../../utils/test_utils';
import { devImports } from '../devPackage';

describe('assemble fast analysis', () => {
  it('should not get triggered', () => {
    const ctx = createContext({
      target: 'server',
    });
    const module = mockDefaultModule(ctx);
    module.fastAnalysis = {
      imports: [],
      report: {
        browserEssentials: ['process'],
      },
    };

    ctx.interceptor.sync('assemble_fast_analysis', { module });
    expect(module.fastAnalysis.imports).toEqual([]);
  });

  it('should get triggered', () => {
    const ctx = createContext({
      target: 'browser',
    });
    const module = mockDefaultModule(ctx);
    module.fastAnalysis = {
      imports: [],
      report: {
        browserEssentials: ['process'],
      },
    };
    ctx.interceptor.sync('assemble_fast_analysis', { module });
    expect(module.fastAnalysis.imports).toEqual([{ type: ImportType.REQUIRE, statement: 'process' }]);
  });

  it('should not fail with missing analysis', () => {
    const ctx = createContext({
      target: 'browser',
    });
    const module = mockDefaultModule(ctx);
    ctx.interceptor.sync('assemble_fast_analysis', { module });
  });

  it('should have process require statement', () => {
    const ctx = createContext({
      target: 'browser',
    });
    const module = mockDefaultModule(ctx);
    module.fastAnalysis = {
      imports: [],
      report: {
        browserEssentials: ['process'],
      },
    };
    ctx.interceptor.sync('assemble_fast_analysis', { module });
    expect(module.header).toEqual(['const process = require("process");']);
  });

  it('should have fusebox default import package', () => {
    const ctx = createContext({
      target: 'browser',
    });
    const module = mockDefaultModule(ctx);
    module.fastAnalysis = {
      imports: [],
      report: {
        dynamicImports: true,
      },
    };
    ctx.interceptor.sync('assemble_fast_analysis', { module });

    expect(module.header).toEqual([`const ${devImports.variable} = require("${devImports.packageName}");`]);
    expect(module.fastAnalysis.imports).toEqual([{ type: ImportType.REQUIRE, statement: devImports.packageName }]);
  });
});
