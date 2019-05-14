import { createContext } from '../../core/Context';
import { ImportType } from '../../resolver/resolver';
import { mockDefaultModule } from '../../utils/test_utils';
import { devImports } from '../devPackage';

describe('assemble fast analysis', () => {
  describe('browser essentials', () => {
    it('should not get triggered', () => {
      const ctx = createContext({
        target: 'server',
      });
      const module = mockDefaultModule(ctx);
      module.fastAnalysis = {
        imports: [],
        report: {
          browserEssentials: [{ moduleName: 'process', variable: 'process' }],
        },
      };

      ctx.ict.sync('assemble_fast_analysis', { module });
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
          browserEssentials: [{ moduleName: 'process', variable: 'process' }],
        },
      };
      ctx.ict.sync('assemble_fast_analysis', { module });
      expect(module.fastAnalysis.imports).toEqual([{ type: ImportType.REQUIRE, statement: 'process' }]);
    });

    it('should not fail with missing analysis', () => {
      const ctx = createContext({
        target: 'browser',
      });
      const module = mockDefaultModule(ctx);
      ctx.ict.sync('assemble_fast_analysis', { module });
    });

    it('should have process require statement', () => {
      const ctx = createContext({
        target: 'browser',
      });
      const module = mockDefaultModule(ctx);
      module.fastAnalysis = {
        imports: [],
        report: {
          browserEssentials: [{ moduleName: 'process', variable: 'process' }],
        },
      };
      ctx.ict.sync('assemble_fast_analysis', { module });
      expect(module.header).toEqual(['var process = require("process");']);
    });

    it('should have buffer require statement', () => {
      const ctx = createContext({
        target: 'browser',
      });
      const module = mockDefaultModule(ctx);
      module.fastAnalysis = {
        imports: [],
        report: {
          browserEssentials: [{ moduleName: 'buffer', variable: 'Buffer' }],
        },
      };
      ctx.ict.sync('assemble_fast_analysis', { module });
      expect(module.header).toEqual(['var Buffer = require("buffer");']);
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
      ctx.ict.sync('assemble_fast_analysis', { module });

      expect(module.header).toEqual([`var ${devImports.variable} = require("${devImports.packageName}");`]);
      expect(module.fastAnalysis.imports).toEqual([{ type: ImportType.REQUIRE, statement: devImports.packageName }]);
    });
  });

  describe('__dirname and __filename', () => {
    it('should contain __dirname', () => {
      const ctx = createContext({
        target: 'browser',
      });
      const module = mockDefaultModule(ctx);
      module.fastAnalysis = {
        imports: [],
        report: {
          contains__dirname: true,
        },
      };
      ctx.ict.sync('assemble_fast_analysis', { module });

      expect(module.header).toEqual(['var __dirname = ".";']);
    });

    it('should not contain __dirname (server)', () => {
      const ctx = createContext({
        target: 'server',
      });
      const module = mockDefaultModule(ctx);
      module.fastAnalysis = {
        imports: [],
        report: {
          contains__dirname: true,
        },
      };
      ctx.ict.sync('assemble_fast_analysis', { module });

      expect(module.header).toEqual([]);
    });

    it('should contain __filename', () => {
      const ctx = createContext({
        target: 'browser',
      });
      const module = mockDefaultModule(ctx);
      module.fastAnalysis = {
        imports: [],
        report: {
          contains__filename: true,
        },
      };
      ctx.ict.sync('assemble_fast_analysis', { module });

      expect(module.header).toEqual(['var __filename = "index.js";']);
    });

    it('should not contain __dirname (server)', () => {
      const ctx = createContext({
        target: 'server',
      });
      const module = mockDefaultModule(ctx);
      module.fastAnalysis = {
        imports: [],
        report: {
          contains__filename: true,
        },
      };
      ctx.ict.sync('assemble_fast_analysis', { module });

      expect(module.header).toEqual([]);
    });
  });
});
