import { writeFileSync } from 'fs';
import * as path from 'path';
import { readFile, removeFile, writeFile } from '../../src/utils/utils';

function getPath(target: string) {
  return path.resolve(__dirname, 'src', target);
}
function modifyFile(target: string) {
  const p = getPath(target);
  let contents = readFile(p);
  contents += '// @modified';
  writeFile(p, contents);
}
function restoreFile(target: string, newContents?: string) {
  const p = getPath(target);
  console.log(p);
  if (newContents) writeFile(p, newContents);
  else {
    let contents = readFile(p);
    contents = contents.replace(/\/\/ @modified/, '');
    writeFile(p, contents);
  }
}

const argv = process.argv;
if (argv.includes('modify')) {
  modifyFile('baz.js');
  modifyFile('index.js');
}

if (argv.includes('restore')) {
  restoreFile('baz.js');
  restoreFile('index.js');
}

const bazContents = `export function baz() {
  alert(2);
}`;
if (argv.includes('remove-baz')) {
  removeFile(getPath('baz.js'));
}

if (argv.includes('restore-baz')) {
  restoreFile('baz.js', bazContents);
}
