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
} from '../utils';

describe('utils', () => {
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

  describe('createRequireConst', () => {
    it('should create a default statement', () => {
      expect(createRequireConst('foo')).toEqual('const foo = require("foo");');
    });

    it('should create a statement', () => {
      expect(createRequireConst('foo', 'bar')).toEqual('const bar = require("foo");');
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
});
