import * as ts from 'typescript';
import * as fs from 'fs';

const contents = fs.readFileSync(__dirname + '/sample.ts').toString();
const sourceFile = ts.createSourceFile('test.ts', contents, ts.ScriptTarget.Latest, true);

function numberTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
  return context => {
    const visit: ts.Visitor = node => {
      if (ts.isVariableDeclaration(node)) {
        //  console.log(node.parent.parent);
      }
      if (ts.isIdentifier(node)) {
        if (node.getText() === 'shit') {
          console.log(node);
        }
      }
      return ts.visitEachChild(node, child => visit(child), context);
    };

    return node => ts.visitNode(node, visit);
  };
}
const result: ts.TransformationResult<ts.SourceFile> = ts.transform(sourceFile, [numberTransformer()]);
const printer: ts.Printer = ts.createPrinter();
const transformedSourceFile = printer.printFile(result.transformed[0]);
