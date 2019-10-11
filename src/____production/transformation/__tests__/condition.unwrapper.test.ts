import { Project } from 'ts-morph';
import { IPublicConfig } from '../../../config/IPublicConfig';
import { createContext } from '../../../core/Context';
import { conditionUnwrapperProduction } from '../conditionUnwrapper';
import { testUtils } from '../../../utils/test_utils';
testUtils();
function createFile(config: IPublicConfig, contents: string) {
  const project = new Project();
  config.target = config.target || 'browser';
  const ctx = createContext(config);
  const file = project.createSourceFile('src/MyClass.ts', contents);
  return { ctx, file, fuseBoxPath: 'foo/bar.js' };
}

describe('Condition unwarpper test ', () => {
  it('should unwrap if true', () => {
    const data = createFile(
      {},
      `
var a = 1;
if( "a" === "a"){
  console.log("yes");
} else {
  console.log("no");
}
var b = 2;
    `,
    );
    conditionUnwrapperProduction(data);
    const text = data.file.getText();
    expect(text).toMatchJSONSnapshot();
  });

  it('should unwrap if false', () => {
    const data = createFile(
      {},
      `
var a = 1;
if( "a" !== "a"){
  console.log("yes");
} else {
  console.log("no");
}
var b = 2;
    `,
    );
    conditionUnwrapperProduction(data);
    const text = data.file.getText();
    expect(text).toMatchJSONSnapshot();
  });

  describe('Simple comparison (1 or 2 args', () => {
    it('should work with single false', () => {
      const original = `if(  false  ){console.log("yes")} else alert('no')`;
      const data = createFile({}, original);
      conditionUnwrapperProduction(data);
      const result = data.file.getText();
      expect(result).toMatchJSONSnapshot();
    });

    it('should work with single true', () => {
      const original = `if(  true  ){console.log("yes")} else alert('no')`;
      const data = createFile({}, original);
      conditionUnwrapperProduction(data);
      const result = data.file.getText();
      expect(result).toMatchJSONSnapshot();
    });

    it('should work with !true', () => {
      const original = `if(!true){console.log("yes")} else alert('no')`;
      const data = createFile({}, original);
      conditionUnwrapperProduction(data);
      const result = data.file.getText();
      expect(result).toMatchJSONSnapshot();
    });

    it('should work without {', () => {
      const original = ` function test(){
          if ("production" === "production")
              return;
      }
      `;
      const data = createFile({}, original);
      conditionUnwrapperProduction(data);
      const result = data.file.getText();
      expect(result).toMatchJSONSnapshot();
    });

    it('should work with !false', () => {
      const original = `if(!false){console.log("yes")} else alert('no')`;
      const data = createFile({}, original);
      conditionUnwrapperProduction(data);
      const result = data.file.getText();
      expect(result).toMatchJSONSnapshot();
    });
  });

  describe('signs test', () => {
    const signs = ['!=', '!==', '===', '==', '>', '>=', '<', '<='];
    signs.forEach(sign => {
      it(`should work correctly with ${sign} and else statement`, () => {
        const original = `if (1 ${sign} 2){alert(1)} else { alert(2) }`;
        const data = createFile({}, original);
        conditionUnwrapperProduction(data);
        const result = data.file.getText();
        expect(result).toMatchJSONSnapshot();
      });

      it(`should work correctly with ${sign} and else statement (without body)`, () => {
        const original = `
        if (1 ${sign} 2)
          alert(1)
        else
          alert(2)`;
        const data = createFile({}, original);
        conditionUnwrapperProduction(data);
        const result = data.file.getText();
        expect(result).toMatchJSONSnapshot();
      });

      it(`should work correctly with ${sign} and else statement (without body and else)`, () => {
        const original = `
        if (1 ${sign} 2)
          alert(1)`;
        const data = createFile({}, original);
        conditionUnwrapperProduction(data);
        const result = data.file.getText();
        expect(result).toMatchJSONSnapshot();
      });

      it(`should work correctly with ${sign} and without statement`, () => {
        const original = `if (1 ${sign} 2){ alert(1) }`;
        const data = createFile({}, original);
        conditionUnwrapperProduction(data);
        const result = data.file.getText();
        expect(result).toMatchJSONSnapshot();
      });
    });
  });
});
