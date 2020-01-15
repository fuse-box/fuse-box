import * as path from 'path';
import { IASTScope } from '../Visitor/Visitor';

export function generateVariableFromSource(source: string, index: number) {
  let variable = path.basename(source).replace(/\.|-/g, '_') + '_' + index;
  if (!/^[a-z]/i.test(variable)) {
    variable = 'a' + variable;
  }
  return variable;
}

export function isLocalDefined(name: string, scope: IASTScope) {
  if (!scope) return;
  if (scope.locals && scope.locals[name] === 1) return true;
  if (scope.hoisted && scope.hoisted[name] === 1) return true;
}
