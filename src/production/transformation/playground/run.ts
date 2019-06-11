import { Project } from 'ts-morph';
import { createESModuleStructure } from '../../structure/ESModuleStructure';
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
export { default } from "./oi"
`);

const structure = createESModuleStructure(file);
console.log(JSON.stringify(structure.toJSON(), null, 2));
