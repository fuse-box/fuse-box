import { Project } from 'ts-morph';
import * as ts from 'typescript';
// import { createRawTransform } from '../raw/rawTransform';

// function createFile(config: IPublicConfig, contents: string) {
//   const project = new Project();
//   config.target = config.target || 'browser';
//   config.logging = { level: 'disabled' };
//   const ctx = createContext(config);

//   return { ctx, contents, fuseBoxPath: 'foo/bar.js' };
// }

// const contents = readFile(__dirname + '/file.js');

// const props = createFile({}, contents);

// const transform = createRawTransform(props);
// console.log(transform.getTransformedText());

function createFile(contents: string) {
  const project = new Project();
  return project.createSourceFile('src/MyClass.ts', contents);
}

const file = createFile(`
function test(){
  if ("production" === "production")
      return;
}
`);

const Identifiers = file.getDescendantsOfKind(ts.SyntaxKind.IfStatement);

Identifiers.forEach(node => {
  if (!node.wasForgotten()) {
    node.replaceWithText(node.getThenStatement().getText());
  }
});

console.log(file.getText());
