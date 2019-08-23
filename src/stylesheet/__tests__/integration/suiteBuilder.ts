import { createTestBundle, IntergationHelper, createFileSet } from '../../../integration/__tests__/intergrationUtils';
import { IPublicConfig } from '../../../config/IPublicConfig';

class BaseCSSTest {
  constructor(public props: { fuse: any; mock: any; helper: IntergationHelper }) {}
}
export function baseCSSTest(config: IPublicConfig, files: { [key: string]: string }) {
  const data = createTestBundle(config, files);
  return new BaseCSSTest(data);
}

function createStyleFileSet(extension, files) {
  const newCollection = {};
  for (const key in files) {
    newCollection[key + '.' + extension] = files[key];
  }
  newCollection['index.js'] = `import "./main.${extension}"`;
  const a = createFileSet(__dirname, newCollection);
  return a;
}

export class CSSTest {
  constructor(public extension: string) {}

  public testSimpleImports() {
    it('should have correct imports 1', async () => {
      const res = createTestBundle(
        { entry: 'index.js', homeDir: __dirname },
        createStyleFileSet(this.extension, {
          main: `
            @import "foo"
            body { color : red}
       `,
          foo: `
           h1 { color : blue}
      `,
        }),
      );

      await res.fuse.runDev();
      const files = res.helper.listDistFiles();
      console.log(files);
      res.mock.flush();
    });
  }
}
