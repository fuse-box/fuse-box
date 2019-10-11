import { IPublicConfig } from '../../../config/IPublicConfig';
import { Project } from 'ts-morph';
import { createContext } from '../../../core/Context';
import { browserProductionPolyfillTransformation } from '../browserPolyfillTransformation';

function createFile(config: IPublicConfig, contents: string) {
  const project = new Project();
  config.target = config.target || 'browser';
  const ctx = createContext(config);
  const file = project.createSourceFile('src/MyClass.ts', contents);
  return { ctx, file, fuseBoxPath: 'foo/bar.js' };
}

describe('Browser polyfill test', () => {
  it('should replace __dirname', () => {
    const data = createFile({}, 'console.log(__dirname)');
    browserProductionPolyfillTransformation(data);
    expect(data.file.getText()).toContain(`console.log("foo")`);
  });

  it('should replace __filename', () => {
    const data = createFile({}, 'console.log(__filename)');
    browserProductionPolyfillTransformation(data);
    expect(data.file.getText()).toContain(`console.log("foo/bar.js")`);
  });

  it('should not inject', () => {
    const data = createFile({}, 'console.log(foo.stream)');
    browserProductionPolyfillTransformation(data);
    expect(data.file.getText()).not.toContain(`import * as stream from "stream";`);
  });

  it('should inject stream', () => {
    const data = createFile({}, 'console.log(stream)');
    browserProductionPolyfillTransformation(data);
    expect(data.file.getText()).toContain(`import * as stream from "stream";`);
  });

  it('should inject buffer', () => {
    const data = createFile({}, 'console.log(buffer)');
    browserProductionPolyfillTransformation(data);
    expect(data.file.getText()).toContain(`import { Buffer as buffer } from "buffer"`);
  });

  it('should inject Buffer', () => {
    const data = createFile({}, 'console.log(Buffer)');
    browserProductionPolyfillTransformation(data);
    expect(data.file.getText()).toContain(`import { Buffer } from "buffer"`);
  });

  it('should inject http', () => {
    const data = createFile({}, 'console.log(http)');
    browserProductionPolyfillTransformation(data);
    expect(data.file.getText()).toContain(`import * as http from "http"`);
  });

  it('should inject https', () => {
    const data = createFile({}, 'console.log(https)');
    browserProductionPolyfillTransformation(data);
    expect(data.file.getText()).toContain(`import * as https from "https"`);
  });
});
