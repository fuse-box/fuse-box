import { Project } from 'ts-morph';
import * as ts from 'typescript';
function createFile(contents: string) {
  const project = new Project();
  return project.createSourceFile('src/MyClass.tsx', contents);
}

const file = createFile(`
function oi(){
  const snapshot = { isDraggingOver: false };
  function getSourceStyle(opts) {
    return {};
  }
  return <div>
        <div></div>
        <p style={getSourceStyle(snapshot.isDraggingOver)}></p>
      </div>
}
`);

file.getDescendantsOfKind(ts.SyntaxKind.Identifier);

// file.getStatements().forEach(statement => {
//   console.log(statement.getKindName());
// });
