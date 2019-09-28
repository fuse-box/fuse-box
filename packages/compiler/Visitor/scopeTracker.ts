import { IASTScope, IVisit } from "./Visitor";

export function scopeTracker(visitor: IVisit): IASTScope {
  const node = visitor.node;
  let scope = visitor.scope;

  if (node.scope) {
    scope = node.scope;
  }

  if (scope && !scope.locals) scope.locals = {};

  if (node.type === "VariableDeclaration") {
    if (node.declarations) {
      for (const decl of node.declarations) {
        if (
          decl.type === "VariableDeclarator" &&
          decl.id &&
          decl.id.type === "Identifier"
        ) {
          if (scope === undefined) scope = { locals: {} };
          scope.locals[decl.id.name] = 1;
          // we need to check for the next item on the list (if we are in an array)
          if (visitor.id !== undefined && visitor.property) {
            if (visitor.parent[visitor.property][visitor.id + 1]) {
              visitor.parent[visitor.property][visitor.id + 1].scope = scope;
            }
          }
        }
      }
    }
  }

  if (node.type === "ExpressionStatement") {
    if (node.expression && node.expression.arguments) {
      node.expression.arguments["scope"] = scope;
    }
  }

  if (
    node.type === "FunctionDeclaration" ||
    node.type === "FunctionExpression"
  ) {
    if (node.id && node.id.type === "Identifier") {
      if (scope === undefined) scope = { locals: {} };
      scope.locals[node.id.name] = 1;
      if (visitor.id && visitor.property) {
        if (visitor.parent[visitor.property][visitor.id + 1]) {
          visitor.parent[visitor.property][visitor.id + 1].scope = scope;
        }
      }
    }

    if (node.params) {
      for (const item of node.params) {
        if (item.type === "Identifier") {
          if (node.body["scope"] === undefined) {
            // copy scope
            let targetLocals = {};
            if (scope) {
              // the fastest way to copy an object
              for (const key in scope.locals) {
                targetLocals[key] = 1;
              }
            }
            node.body["scope"] = {
              locals: targetLocals
            };
          }
          node.body["scope"].locals[item.name] = 1;
        }
      }
    }
  }
  visitor.scope = scope;
  return scope;
}
