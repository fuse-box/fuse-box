import Project from 'ts-morph';
import { IPublicConfig } from '../../../config/IPublicConfig';
import { createContext } from '../../../core/Context';
import { conditionUnwrapperProduction } from '../conditionUnwrapper';

function createFile(config: IPublicConfig, contents: string) {
  const project = new Project();
  config.target = config.target || 'browser';
  const ctx = createContext(config);
  const file = project.createSourceFile('src/MyClass.ts', contents);
  return { ctx, file, fuseBoxPath: 'foo/bar.js' };
}

describe('Condition unwarpper test ', () => {
  it('should unwrap if', () => {
    const data = createFile(
      {},
      `
      var a = 1;
      if( "a" === "a"){
        console.log("yes");
        console.log('ooo yeah');
      } else {
        console.log("no");
      }
    `,
    );
    conditionUnwrapperProduction(data);
    console.log(data.file.getText());
  });
});
