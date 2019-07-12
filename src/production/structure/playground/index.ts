import { Project } from 'ts-morph';
import { createESModuleStructure } from '../ESModuleStructure';

function createFile(contents: string) {
  const project = new Project();
  return project.createSourceFile('src/MyClass.ts', contents);
}

const file = createFile(`
import foo from "hello"
`);
const structure = createESModuleStructure(file);

// file.getStatements().forEach(statement => {
//   console.log(statement.getKindName());
// });
