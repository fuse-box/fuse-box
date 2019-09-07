import { getFolderEntryPointFromPackageJSON } from '../shared';

describe('shared functions', () => {
  describe('getFolderEntryPointFromPackageJSON', () => {
    it('Should return brwoser field', () => {
      const res = getFolderEntryPointFromPackageJSON({ json: { browser: 'foo.js' }, isBrowserBuild: true });
      expect(res).toEqual('foo.js');
    });

    it('Should module despite having brwoser', () => {
      const res = getFolderEntryPointFromPackageJSON({ json: { browser: 'foo.js', module: 'mod.js' } });
      expect(res).toEqual('mod.js');
    });

    it('Should return module', () => {
      const res = getFolderEntryPointFromPackageJSON({ json: { module: 'mod.js' } });
      expect(res).toEqual('mod.js');
    });

    it('Should return ts:main', () => {
      const res = getFolderEntryPointFromPackageJSON({ json: { 'ts:main': 'mod.ts' } });
      expect(res).toEqual('mod.ts');
    });

    it('Should return main', () => {
      const res = getFolderEntryPointFromPackageJSON({ json: { main: 'oi.js' } });
      expect(res).toEqual('oi.js');
    });

    it('Should return index without anything', () => {
      const res = getFolderEntryPointFromPackageJSON({ json: {} });
      expect(res).toEqual('index.js');
    });

    it('Precedence test - all types & useLocalField: true - should return "local:main"', () => {
      const res = getFolderEntryPointFromPackageJSON({
        useLocalField: true,
        json: { main: 'main.js', 'ts:main': 'tsmain.ts', 'local:main': 'localmain.js', module: 'module.js' },
      });
      expect(res).toEqual('localmain.js');
    });

    it('Precedence test - all types & useLocalField: false - should return "ts:main"', () => {
      const res = getFolderEntryPointFromPackageJSON({
        json: { main: 'main.js', 'ts:main': 'tsmain.ts', 'local:main': 'localmain.js', module: 'module.js' },
      });
      expect(res).toEqual('tsmain.ts');
    });

    it('Precedence test - missing ts:main - should return "module"', () => {
      const res = getFolderEntryPointFromPackageJSON({
        json: { main: 'main.js', 'local:main': 'localmain.js', module: 'module.js' },
      });
      expect(res).toEqual('module.js');
    });

    it('Precedence test - missing ts:main or module - should return "main"', () => {
      const res = getFolderEntryPointFromPackageJSON({
        json: { main: 'main.js', 'local:main': 'localmain.js' },
      });
      expect(res).toEqual('main.js');
    });
  });
});
