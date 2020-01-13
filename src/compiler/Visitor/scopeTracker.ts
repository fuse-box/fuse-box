import { IASTScope, IVisit } from './Visitor';

const _FunctionDecl = {
  ArrowFunctionExpression: 1,
  ClassDeclaration: 1,
  FunctionDeclaration: 1,
  FunctionExpression: 1,
};
function copyScopeToNextNode(visitor: IVisit, scope) {
  const { id, parent, property } = visitor;
  const newLocals = {};
  for (const key in scope.locals) newLocals[key] = 1;
  if (parent[property][id + 1]) {
    parent[property][id + 1].scope = { locals: newLocals };
  }
}

function copy(scope, extra?) {
  const newLocals = {};
  for (const key in scope.locals) newLocals[key] = 1;
  if (extra) {
    for (const key in extra) newLocals[key] = 1;
  }
  return { locals: newLocals };
}
export function scopeTracker(visitor: IVisit): IASTScope {
  const { node, parent, property } = visitor;
  const type = node.type;

  let scope = node.scope ? node.scope : visitor.scope;

  if (type === 'VariableDeclaration') {
    // here we just update the existing scope
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
      if (visitor.id !== undefined && property) copyScopeToNextNode(visitor, scope);
    }
  } else if (type === 'ExpressionStatement') {
    if (node.expression && node.expression.arguments) {
      node.expression.arguments['scope'] = scope;
    }
  }
  // grab function declaration but avoid those defined in the expression statement.e.g
  // var a = function hey(){}
  // or
  // function hey(){}
  // this should be copied to the next item in the body
  else if (_FunctionDecl[type] && parent.right !== node) {
    if (node.body) {
      scope = scope ? copy(scope) : { locals: {} };

      if (node.id && node.id.name) {
        scope.locals[node.id.name] = 1;
      }
      if (visitor.id !== undefined && property) copyScopeToNextNode(visitor, scope);

      if (node.params) {
        // create params scope
        // .e.g function(one, two) {}
        // the body of this function should have a copy a of the parent scope + its own local variables
        const funcScope = {};
        for (const item of node.params) {
          if (item.type === 'Identifier') funcScope[item.name] = 1;
        }
        node.body['scope'] = copy(scope, funcScope);
      }
    }
  }

  // visiting node.body ahead of time (the visitor isn't there yet)
  // but we need to collect hoisted variables
  if (Array.isArray(node.body) && node.body[0]) {
    scope = scope || { locals: {} };

    const elScope = scope || { locals: {} };
    // when hoisting it's just enough to add the first item on list
    // since we're there yet, the visitor will pick it up and propagate till the end of the list
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
