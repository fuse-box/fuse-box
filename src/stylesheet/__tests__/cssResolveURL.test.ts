import { createContext } from '../../core/Context';
import { cssResolveURL } from '../cssResolveURL';
import { mockWriteFile } from '../../utils/test_utils';
import * as path from 'path';

const fileMock = mockWriteFile();

describe('CSS Resolve URL test', () => {
  afterAll(() => fileMock.unmock());
  beforeEach(() => fileMock.flush());

  it('should resolve image 1', () => {
    fileMock.addFile(path.join(__dirname, 'hello.png'), '');
    const ctx = createContext({ homeDir: __dirname });
    const props = {
      contents: `url("./hello.png")`,
      filePath: __filename,
      ctx: ctx,
      options: {},
    };
    const res = cssResolveURL(props);
    expect(res.contents).toContain(`url("/resources`);
  });

  it('should not resolve svg filter', () => {
    fileMock.addFile(path.join(__dirname, 'hello.png'), '');
    const ctx = createContext({ homeDir: __dirname });
    const props = {
      contents: `url(#svgFilter)`,
      filePath: __filename,
      ctx: ctx,
      options: {},
    };
    const res = cssResolveURL(props);
    expect(res.contents).toEqual(`url(#svgFilter)`);
  });

  it('should not resolve svg filter ( keep formatting 1)', () => {
    fileMock.addFile(path.join(__dirname, 'hello.png'), '');
    const ctx = createContext({ homeDir: __dirname });
    const props = {
      contents: `url('#svgFilter')`,
      filePath: __filename,
      ctx: ctx,
      options: {},
    };
    const res = cssResolveURL(props);
    expect(res.contents).toEqual(`url('#svgFilter')`);
  });

  it('should not resolve svg filter ( keep formatting 1)', () => {
    fileMock.addFile(path.join(__dirname, 'hello.png'), '');
    const ctx = createContext({ homeDir: __dirname });
    const props = {
      contents: `url("#svgFilter")`,
      filePath: __filename,
      ctx: ctx,
      options: {},
    };
    const res = cssResolveURL(props);
    expect(res.contents).toEqual(`url("#svgFilter")`);
  });

  it('should keep http references', () => {
    fileMock.addFile(path.join(__dirname, 'hello.png'), '');
    const ctx = createContext({ homeDir: __dirname });
    const props = {
      contents: `url(http://foo.com/hello.png)`,
      filePath: __filename,
      ctx: ctx,
      options: {},
    };
    const res = cssResolveURL(props);
    expect(res.contents).toContain(`url(http://foo.com/hello.png`);
  });

  it('should keep mixin', () => {
    fileMock.addFile(path.join(__dirname, 'hello.png'), '');
    const ctx = createContext({ homeDir: __dirname });
    const props = {
      contents: `
      @mixin svg($url) {
        mask-image: url($url) no-repeat 100% 100%;
      }

      `,
      filePath: __filename,
      ctx: ctx,
      options: {},
    };
    const res = cssResolveURL(props);
    expect(res.contents).toContain(`url($url)`);
  });

  it('should skip and data:', () => {
    fileMock.addFile(path.join(__dirname, 'hello.png'), '');
    const ctx = createContext({ homeDir: __dirname });
    const props = {
      contents: `url('data:image/png;base64,iVBO')`,
      filePath: __filename,
      ctx: ctx,
      options: {},
    };
    const res = cssResolveURL(props);
    expect(res.contents).toEqual(`url('data:image/png;base64,iVBO')`);
  });
});
