import { IASTScope, IVisit } from './Visitor';

const _FunctionDecl = {
  FunctionDeclaration: 1,
  FunctionExpression: 1,
};
export function scopeTracker(visitor: IVisit): IASTScope {
  const { node, parent, property } = visitor;
  const type = node.type;

  let scope = visitor.scope;

  if (node.scope) {
    scope = node.scope;
  }

  // const parent = visitor.parent;
  // const property = visitor.property;

  if (scope && !scope.locals) scope.locals = {};

  if (type === 'VariableDeclaration') {
    if (node.declarations) {
      for (const decl of node.declarations) {
        if (decl.type === 'VariableDeclarator' && decl.id && decl.id.type === 'Identifier') {
          if (scope === undefined) scope = { locals: {} };
          scope.locals[decl.id.name] = 1;
          // we need to check for the next item on the list (if we are in an array)
          if (visitor.id !== undefined && property) {
            if (parent[property][visitor.id + 1]) {
              parent[property][visitor.id + 1].scope = scope;
            }
          }
        }
      }
    }
  } else if (type === 'ExpressionStatement') {
    if (node.expression && node.expression.arguments) {
      node.expression.arguments['scope'] = scope;
    }
  } else if (_FunctionDecl[type]) {
    if (node.id && node.id.type === 'Identifier') {
      if (scope === undefined) scope = { locals: {} };
      scope.locals[node.id.name] = 1;
      if (visitor.id && property) {
        if (parent[property][visitor.id + 1]) {
          parent[property][visitor.id + 1].scope = scope;
        }
      }
    }

    if (node.params) {
      for (const item of node.params) {
        if (item.type === 'Identifier') {
          if (node.body['scope'] === undefined) {
            // copy scope
            let targetLocals = {};
            if (scope) {
              // the fastest way to copy an object
              for (const key in scope.locals) targetLocals[key] = 1;
            }
            node.body['scope'] = {
              locals: targetLocals,
            };
          }
          node.body['scope'].locals[item.name] = 1;
        }
      }
    }
  }
  visitor.scope = scope;
  return scope;
}
