import { IASTScope, IVisit } from './Visitor';

const _FunctionDecl = {
  FunctionDeclaration: 1,
  FunctionExpression: 1,
  ClassDeclaration: 1,
  ArrowFunctionExpression: 1,
};
function copyScope(visitor: IVisit, scope) {
  const { id, property, parent } = visitor;

  const newScope = {};
  for (const key in scope.locals) newScope[key] = 1;
  if (parent[property][id + 1]) {
    parent[property][id + 1].scope = { locals: newScope };
  }
}
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
      if (scope === undefined) scope = { locals: {} };
      for (const decl of node.declarations) {
        if (decl.type === 'VariableDeclarator' && decl.id) {
          const id = decl.id;
          if (id.type === 'Identifier') {
            scope.locals[id.name] = 1;
          } else if (id.type === 'ArrayPattern') {
            if (id.elements) {
              for (const el of id.elements) {
                if (el) {
                  if (el.type === 'Identifier') {
                    scope.locals[el.name] = 1;
                  } else if (el.type === 'RestElement') {
                    scope.locals[el.argument.name] = 1;
                  }
                }
              }
            }
          } else if (id.type === 'ObjectPattern' && id.properties) {
            for (const prop of id.properties) {
              if (prop.type === 'Property' && prop.key.name === prop.value.name) {
                scope.locals[prop.key.name] = 1;
              } else if (prop.type === 'RestElement') {
                scope.locals[prop.argument.name] = 1;
              }
            }
          }
        }
      }
      // we need to check for the next item on the list (if we are in an array)
      if (visitor.id !== undefined && property) {
        copyScope(visitor, scope);
      }
    }
  } else if (type === 'ExpressionStatement') {
    if (node.expression && node.expression.arguments) {
      node.expression.arguments['scope'] = scope;
    }
  }
  // grab function declaration but avoid those defined in the expression statement.e.g
  // var a = function hey(){}
  else if (_FunctionDecl[type] && parent.right !== node) {
    if (node.body) {
      if (scope === undefined) scope = { locals: {} };

      if (node.id && node.id.name) {
        scope.locals[node.id.name] = 1;
      }
      if (visitor.id !== undefined && property) {
        copyScope(visitor, scope);
      }
    }
    if (node.params) {
      for (const item of node.params) {
        if (item.type === 'Identifier' && node.body) {
          if (node.body['scope'] === undefined) {
            // copy scope
            let targetLocals = {};
            if (scope) {
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

  if (Array.isArray(node.body) && node.body[0]) {
    scope = scope || { locals: {} };

    const elScope = scope || { locals: {} };
    node.body[0].scope = elScope;
    // hoisted variables
    for (const item of node.body) {
      if (item.type === 'FunctionDeclaration' && item.body && item.id) {
        elScope.locals[item.id.name] = 1;
      } else if (item.type == 'VariableDeclaration' && item.kind === 'var' && item.declarations) {
        for (const i of item.declarations) {
          elScope.locals[i.id.name] = 1;
        }
      }
    }
  }
  visitor.scope = scope;
  return scope;
}
