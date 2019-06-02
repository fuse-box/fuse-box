import * as ts from 'typescript';
import * as fs from 'fs';
import { Project } from 'ts-morph';

const contents = fs.readFileSync(__dirname + '/sample.ts').toString();

const project = new Project();

const testFile = project.createSourceFile('src/MyClass.ts', contents);

function handle() {
  const processDeclared = testFile.getVariableDeclaration('process');

  function isDeclared(names: Array<string>) {
    const ids = testFile.getDescendantsOfKind(ts.SyntaxKind.Identifier);
    ids.forEach(item => {
      if (names.includes(item.getText())) {
        const refs = item.findReferencesAsNodes();
      }
    });
  }

  const Identifiers = testFile.getDescendantsOfKind(ts.SyntaxKind.Identifier);
  Identifiers.forEach(id => {
    if (!id.wasForgotten()) {
      if (id.getText() === 'process') {
        const parent = id.getParent();
        if (ts.isPropertyAccessExpression(parent.compilerNode)) {
          const secondProperty = parent.compilerNode.name.getText();
          const main = parent.getParent().compilerNode;
          if (ts.isPropertyAccessExpression(main)) {
            const third = main.name.getText();
            if (id.findReferences().length === 0) {
              parent.getParent().replaceWithText("'development'");
            }
          }
        }
      }
    }
  });

  const ifs = testFile.getDescendantsOfKind(ts.SyntaxKind.IfStatement);
  ifs.forEach(item => {
    const oi = item.compilerNode;
    if (ts.isExpressionStatement(oi)) {
    }
    console.log(item.compilerNode.expression);
  });

  // const ids = testFile.getDescendantsOfKind(ts.SyntaxKind.Identifier);
  // ids.forEach(id => {
  //   if (id.getText() === 'bar') {
  //     //console.log('parent', id.getParent().getText());
  //     id.findReferences().forEach(ref => {
  //       console.log(
  //         ref
  //           .getDefinition()
  //           .getNode()
  //           .getParent()
  //           .getParent()
  //           .getParent()
  //           .getText(),
  //       );
  //     });
  //   }
  // });
}
handle();
console.log('>>>>>>>>');
console.log(testFile.getText());
