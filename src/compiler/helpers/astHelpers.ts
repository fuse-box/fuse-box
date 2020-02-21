import * as path from 'path';
import { IASTScope } from '../Visitor/Visitor';
import { ASTNode } from '../interfaces/AST';

export function generateModuleNameFromSource(source: string, sourceReferences) {
  let variable = path.basename(source).replace(/\.|-/g, '_');
  let index: number = 1;
  if (!/^[a-z]/i.test(variable)) variable = 'a' + variable;

  // we have this variable already
  if (variable in sourceReferences) {
    index = sourceReferences[variable].current + 1;
    sourceReferences[variable].current = index;
    sourceReferences[variable].sources[source] = index;
  } else {
    sourceReferences[variable] = {
      current: index,
      sources: {
        [source]: index,
      },
    };
  }
  variable = variable + '_' + index;
  return variable;
}

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

export function createUndefinedVariable(name: string): ASTNode {
  return {
    definite: false,
    id: {
      name: name,
      optional: false,
      type: 'Identifier',
    },
    init: null,
    type: 'VariableDeclarator',
  };
}
export function createVariableDeclaration(): ASTNode {
  return {
    declarations: [],
    kind: 'var',
    type: 'VariableDeclaration',
  } as ASTNode;
}
