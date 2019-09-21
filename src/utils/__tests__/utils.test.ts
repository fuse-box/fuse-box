import {
  path2Regex,
  createRequireConst,
  replaceExt,
  extractFuseBoxPath,
  makeFuseBoxPath,
  ensurePublicExtension,
  getExtension,
  ensureFuseBoxPath,
  joinFuseBoxPath,
  createStringConst,
  createVarString,
  parseVersion,
  beautifyBundleName,
  path2RegexPattern,
} from '../utils';

describe('utils', () => {
  describe('beautifyBundleName', () => {
    it('should beautifyBundleName 1', () => {
      const name = beautifyBundleName('foo/bar/oi.js', 20);
      expect(name).toEqual('foo-bar-oi');
    });
    it('should beautifyBundleName 2', () => {
      const name = beautifyBundleName('oi.js', 20);
      expect(name).toEqual('oi');
    });
    it('should beautifyBundleName 3', () => {
      const name = beautifyBundleName('./not-found-page/not-found-page/not-found-page.module', 20);
      expect(name).toEqual('not-found-page');
    });
    it('should beautifyBundleName 4', () => {
      const name = beautifyBundleName('./not-found-page/not-found-page/not-found-page.module');
      expect(name).toEqual('not-found-page-not-found-page-not-found-page');
    });

    it('should beautifyBundleName 5', () => {
      const name = beautifyBundleName('./not-found-page/not-found-page/not-found-page.module', 10);
      expect(name).toEqual('not-found-page');
    });

    it('should beautifyBundleName 6', () => {
      const name = beautifyBundleName('./this/path/is/wild/right/ok.module');
      expect(name).toEqual('this-path-is-wild-right-ok');
    });

    it('should beautifyBundleName 6', () => {
      const name = beautifyBundleName('./site/not-found/not-found.module');
      expect(name).toEqual('site-not-found-not-found');
    });

    it('should beautifyBundleName 6', () => {
      const name = beautifyBundleName('ngc/browser/site/not-found/not-found.module.js');
      expect(name).toEqual('ngc-browser-site-not-found-not-found.module');
    });

    it('should beautifyBundleName 7', () => {
      const name = beautifyBundleName('./ngc/browser/site/not-found/not-found.module.js');
      expect(name).toEqual('ngc-browser-site-not-found-not-found.module');
    });
  });
  describe('parseVersion', () => {
    it('should parse with v', () => {
      const res = parseVersion('v11.13.0');

      expect(res).toEqual([11, 13, 0]);
    });

    it('should parse without v', () => {
      const res = parseVersion('11.13.0');
      expect(res).toEqual([11, 13, 0]);
    });
  });
  describe('path2Regex', () => {
    it('should convert', () => {
      const a = path2Regex('foo/bar.js');
      expect(a).toEqual(/foo\/bar.js/);
    });

    it('should be cached', () => {
      const a = path2Regex('foo/bar.js');
      expect(a).toEqual(/foo\/bar.js/);
    });
  });

  describe('createStringConst', () => {
    it('should create createStringConst', () => {
      const str = createStringConst('foo', 'b\'a"r');
      expect(str).toEqual(`const foo = "b'a\\"r";`);
    });
  });

  describe('createVarString', () => {
    it('should create createVarConst', () => {
      const str = createVarString('foo', 'b\'a"r');
      expect(str).toEqual(`var foo = "b'a\\"r";`);
    });
  });

  describe('createRequireConst', () => {
    it('should create a default statement', () => {
      expect(createRequireConst('foo')).toEqual('var foo = require("foo");');
    });

    it('should create a statement', () => {
      expect(createRequireConst('foo', 'bar')).toEqual('var bar = require("foo");');
    });
  });

  describe('replaceExt', () => {
    it('should be ok with empty value', () => {
      expect(replaceExt('', '.js')).toEqual('');
    });

    it('should replace existing ext', () => {
      expect(replaceExt('foo.js', '.ts')).toEqual('foo.ts');
    });

    it('should add ext', () => {
      expect(replaceExt('foo', '.ts')).toEqual('foo.ts');
    });
  });

  describe('extractFuseBoxPath', () => {
    it('extractFuseBoxPath', () => {
      expect(extractFuseBoxPath('/home/my/dir', '/home/my/dir/foo/bar.ts')).toEqual('foo/bar.ts');
    });
  });

  describe('makeFuseBoxPath', () => {
    it('makeFuseBoxPath', () => {
      expect(makeFuseBoxPath('/home/my/dir', '/home/my/dir/foo/bar.ts')).toEqual('foo/bar.js');
    });
  });

  describe('ensurePublicExtension', () => {
    it('ensurePublicExtension', () => {
      expect(ensurePublicExtension('bar.ts')).toEqual('bar.js');
      expect(ensurePublicExtension('bar.tsx')).toEqual('bar.jsx');
    });
  });

  describe('getExtension', () => {
    it('getExtension', () => {
      expect(getExtension('bar.ts')).toEqual('.ts');
    });
  });

  describe('ensureFuseBoxPath', () => {
    it('ensureFuseBoxPath', () => {
      expect(ensureFuseBoxPath(`windows\\bar.ts`)).toEqual('windows/bar.ts');
    });
  });

  describe('joinFuseBoxPath', () => {
    it('joinFuseBoxPath', () => {
      expect(joinFuseBoxPath(`windows\\bar`, 'foo/', 'oi')).toEqual('windows/bar/foo/oi');
      expect(joinFuseBoxPath('http://sdf', 'bar')).toEqual('http://sdf/bar');

      //expect(joinFuseBoxPath(`windows\\bar`, 'foo/', 'oi')).toEqual('windows/bar.ts');
    });
  });

  describe('path2RegexPattern', () => {
    it('ensureFuseBoxPath - check \\ vs /', () => {
      expect(path2RegexPattern(`users\\documents\\bar.ts`).test('users/documents/bar.ts')).toEqual(true);
    });

    it('ensureFuseBoxPath - check / vs \\', () => {
      expect(path2RegexPattern(`users/documents/bar.ts`).test('users\\documents\\bar.ts')).toEqual(true);
    });

    it('ensureFuseBoxPath - check single dir using /', () => {
      expect(path2RegexPattern(`/documents/`).test('users\\documents\\bar.ts')).toEqual(true);
    });

    it('ensureFuseBoxPath - check single dir using \\', () => {
      expect(path2RegexPattern(`\\documents\\`).test('users/documents/bar.ts')).toEqual(true);
    });
  });
});
