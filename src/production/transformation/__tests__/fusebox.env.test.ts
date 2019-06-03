import Project from 'ts-morph';
import { IPublicConfig } from '../../../config/IPublicConfig';
import { createContext } from '../../../core/Context';
import { fuseBoxEnvProductionTransformation } from '../fuseBoxEnvTransformation';

function createFile(config: IPublicConfig, contents: string) {
  const project = new Project();
  config.target = config.target || 'browser';
  const ctx = createContext(config);
  const file = project.createSourceFile('src/MyClass.ts', contents);
  return { ctx, file, fuseBoxPath: 'foo/bar.js' };
}

describe('FuseBox env ', () => {
  it('should replace server (browser on)', () => {
    const data = createFile({}, 'console.log(FuseBox.isServer)');
    fuseBoxEnvProductionTransformation(data);
    expect(data.file.getText()).toContain(`console.log(false)`);
  });
  it('should replace browser (browser on)', () => {
    const data = createFile({}, 'console.log(FuseBox.isBrowser)');
    fuseBoxEnvProductionTransformation(data);
    expect(data.file.getText()).toContain(`console.log(true)`);
  });

  it('should replace server (server on)', () => {
    const data = createFile({ target: 'server' }, 'console.log(FuseBox.isServer)');
    fuseBoxEnvProductionTransformation(data);
    expect(data.file.getText()).toContain(`console.log(true)`);
  });

  it('should replace browser (server on)', () => {
    const data = createFile({ target: 'server' }, 'console.log(FuseBox.isBrowser)');
    fuseBoxEnvProductionTransformation(data);
    expect(data.file.getText()).toContain(`console.log(false)`);
  });
});
