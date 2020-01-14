import * as path from 'path';

export function generateVariableFromSource(source: string, index: number) {
  let variable = path.basename(source).replace(/\.|-/g, '_') + '_' + index;
  if (!/^[a-z]/i.test(variable)) {
    variable = 'a' + variable;
  }
  return variable;
}
