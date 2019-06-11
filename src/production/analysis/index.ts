import { Project, ExportDeclaration } from 'ts-morph';
import * as ts from 'typescript';
const project = new Project();
const testFile = project.createSourceFile(
  'src/MyClass.ts',
  `
  export { Button } from './Button';
  export { Header } from './Header';
  export { default as Layout } from './Layout/Layout';
  export function bar(){}
  export function satana(){}
  export class Oi {

  }
  export const a = 1;
`,
);
const start = new Date().getTime();
//testFile.getExportedDeclarations();
// testFile.getExportAssignments();

// testFile.getImportDeclarations();

const decls = testFile.getDescendantsOfKind(ts.SyntaxKind.ExportKeyword);
decls.forEach(exportsKeyWord => {
  const parent = exportsKeyWord.getParent();
  if (parent) {
    switch (parent.getKind()) {
      case ts.SyntaxKind.FunctionDeclaration:
      case ts.SyntaxKind.ClassDeclaration:
        let name = parent.compilerNode['name'];
        if (name) {
          //console.log(name.getText());
        }
        break;
      case ts.SyntaxKind.ExportDeclaration:
        const exportDecl = parent as ExportDeclaration;

        let fromModule;
        if (exportDecl.getModuleSpecifier()) {
          fromModule = exportDecl.getModuleSpecifier().getText();
        }

        exportDecl.getNamedExports().forEach(en => {
          let exportedName, importedName;
          if (en.getAliasNode()) {
            exportedName = en.getAliasNode().getText();
          } else if (en.getNameNode()) {
            exportedName = en.getNameNode().getText();
          }
          if (en.getNameNode()) {
            importedName = en.getNameNode().getText();
          }

          console.log(fromModule, exportedName, importedName);
        });

        //console.log(parent.getText());
        break;
      default:
        break;
    }
  }
});

console.log(`took: ${new Date().getTime() - start}`);
