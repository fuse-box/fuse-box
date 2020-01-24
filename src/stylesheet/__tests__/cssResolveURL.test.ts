import * as path from 'path';
import { createContext } from '../../core/context';
import { distWriter } from '../../output/distWriter';
import { createTestContext, mockWriteFile } from '../../utils/test_utils';
import { cssResolveURL } from '../cssResolveURL';

const fileMock = mockWriteFile();

describe('CSS Resolve URL test', () => {
  afterAll(() => fileMock.unmock());
  beforeEach(() => fileMock.flush());

  it('should resolve image 1', () => {
    fileMock.addFile(path.join(__dirname, 'hello.png'), '');

    const ctx = createTestContext();
    ctx.writer = distWriter({ root: __dirname });
    const props = {
      contents: `url("./hello.png")`,
      ctx: ctx,
      filePath: __filename,
      options: {},
    };
    const res = cssResolveURL(props);
    expect(res.contents).toContain(`url("/resources`);
  });

  it('should not resolve svg filter', () => {
    fileMock.addFile(path.join(__dirname, 'hello.png'), '');
    const ctx = createTestContext();
    const props = {
      contents: `url(#svgFilter)`,
      ctx: ctx,
      filePath: __filename,
      options: {},
    };
    const res = cssResolveURL(props);
    expect(res.contents).toEqual(`url(#svgFilter)`);
  });

  it('should not resolve svg filter ( keep formatting 1)', () => {
    fileMock.addFile(path.join(__dirname, 'hello.png'), '');
    const ctx = createTestContext();
    const props = {
      contents: `url('#svgFilter')`,
      ctx: ctx,
      filePath: __filename,
      options: {},
    };
    const res = cssResolveURL(props);
    expect(res.contents).toEqual(`url('#svgFilter')`);
  });

  it('should not resolve svg filter ( keep formatting 1)', () => {
    fileMock.addFile(path.join(__dirname, 'hello.png'), '');
    const ctx = createTestContext();
    const props = {
      contents: `url("#svgFilter")`,
      ctx: ctx,
      filePath: __filename,
      options: {},
    };
    const res = cssResolveURL(props);
    expect(res.contents).toEqual(`url("#svgFilter")`);
  });

  it('should keep http references', () => {
    fileMock.addFile(path.join(__dirname, 'hello.png'), '');
    const ctx = createTestContext();
    const props = {
      contents: `url(http://foo.com/hello.png)`,
      ctx: ctx,
      filePath: __filename,
      options: {},
    };
    const res = cssResolveURL(props);
    expect(res.contents).toContain(`url(http://foo.com/hello.png`);
  });

  it('should keep mixin', () => {
    fileMock.addFile(path.join(__dirname, 'hello.png'), '');
    const ctx = createTestContext();
    const props = {
      contents: `
      @mixin svg($url) {
        mask-image: url($url) no-repeat 100% 100%;
      }

      `,
      ctx: ctx,
      filePath: __filename,
      options: {},
    };
    const res = cssResolveURL(props);
    expect(res.contents).toContain(`url($url)`);
  });

  it('should skip and data:', () => {
    fileMock.addFile(path.join(__dirname, 'hello.png'), '');
    const ctx = createTestContext();
    const props = {
      contents: `url('data:image/png;base64,iVBO')`,
      ctx: ctx,
      filePath: __filename,
      options: {},
    };

    const res = cssResolveURL(props);
    expect(res.contents).toEqual(`url('data:image/png;base64,iVBO')`);
  });
});
