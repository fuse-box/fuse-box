import { ASTNode, ASTType } from '../interfaces/AST';
import { IASTScope, IVisit } from './Visitor';

const _FunctionDecl = {
  ArrowFunctionExpression: 1,
  ClassDeclaration: 1,
  FunctionDeclaration: 1,
  FunctionExpression: 1,
};

const _Body = {
  [ASTType.BlockStatement]: 1,
  [ASTType.Program]: 1,
};
function copyScopeToNextNode(visitor: IVisit, scope) {
  const { id, parent, property } = visitor;
  const newLocals = {};
  for (const key in scope.locals) newLocals[key] = 1;
  if (parent[property][id + 1]) {
    parent[property][id + 1].scope = { hoisted: scope.hoisted, locals: newLocals };
  }
}

function copy(scope: IASTScope, extra?): IASTScope {
  const newLocals = {};
  for (const key in scope.locals) newLocals[key] = 1;
  if (extra) {
    for (const key in extra) newLocals[key] = 1;
  }

  return { hoisted: scope.hoisted, locals: newLocals };
}

export function extractDefinedVariables(node: ASTNode, names: Record<string, number>) {
  if (node.type === ASTType.Identifier) {
    names[node.name] = 1;
    return;
  }

  if (node.type === ASTType.ObjectPattern) {
    for (const property of node.properties) {
      let target = property;
      if (property.type === ASTType.Property) target = property.value;
      extractDefinedVariables(target, names);
    }
  }
  if (node.type === ASTType.ArrayPattern) {
    for (const element of node.elements) {
      if (element) extractDefinedVariables(element, names);
    }
  }

  if (node.type === ASTType.RestElement) {
    return extractDefinedVariables(node.argument, names);
  }
}

export function scopeTracker(visitor: IVisit): IASTScope {
  const { node, property } = visitor;
  const type = node.type;

  let scope = node.scope ? node.scope : visitor.scope;
  if (type === 'VariableDeclaration') {
    // here we just update the existing scope
    if (node.declarations) {
      if (scope === undefined) scope = { locals: {} };
      for (const decl of node.declarations) {
        if (decl.type === 'VariableDeclarator' && decl.id) {
          extractDefinedVariables(decl.id, scope.locals);
        }
      }
      // we need to check for the next item on the list (if we are in an array)
      if (visitor.id !== undefined && property) {
        copyScopeToNextNode(visitor, scope);
      }
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
  else if (_FunctionDecl[type]) {
    if (node.body) {
      scope = scope ? copy(scope) : { locals: {} };

      if (node.id && node.id.name) {
        scope.locals[node.id.name] = 1;
      }
      if (visitor.id !== undefined && property) {
        copyScopeToNextNode(visitor, scope);
      }

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
  else if (_Body[node.type] && node.body[0]) {
    scope = scope ? scope : { locals: {} };
    const elScope = scope;
    const bodyEl = node.body[0];
    // when hoisting it's just enough to add the first item on list
    // since we're there yet, the visitor will pick it up and propagate till the end of the list
    bodyEl.scope = elScope;
    // hoisted variables
    const hoisted = {};
    let index = 0;
    let shouldAdd = false;
    const bodyNodesLength = (node.body as Array<ASTNode>).length;
    while (index < bodyNodesLength) {
      const item: ASTNode = node.body[index];
      if (item.type === 'FunctionDeclaration' && item.body && item.id) {
        hoisted[item.id.name] = 1;
        shouldAdd = true;
      } else if (item.type == 'VariableDeclaration' && item.kind === 'var' && item.declarations) {
        // for (const i of item.declarations) {
        //   shouldAdd = true;
        //   hoisted[i.id.name] = 1;
        // }
      }
      index++;
    }
    if (shouldAdd) {
      if (elScope.hoisted) {
        for (const key in elScope.hoisted) {
          hoisted[key] = 1;
        }
      }
      elScope.hoisted = hoisted;
    }
  }

  visitor.scope = scope;
  return scope;
}
