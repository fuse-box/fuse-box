import { ASTNode, ASTType } from '../interfaces/AST';
import { IVisit } from './Visitor';

const _FunctionDecl = {
  ArrowFunctionExpression: 1,
  ClassDeclaration: 1,
  FunctionDeclaration: 1,
  FunctionExpression: 1,
  [ASTType.CatchClause]: 1,
  [ASTType.EnumDeclaration]: 1,
};

// const _Body = {
//   [ASTType.BlockStatement]: 1,
//   [ASTType.Program]: 1,
// };

export function extractDefinedVariables(node: ASTNode, names: Record<string, ASTNode>) {
  if (node.type === ASTType.Identifier) {
    names[node.name] = node;
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

function extractDeclarations(node: ASTNode, bodyScope: Record<string, ASTNode>) {
  if (!node.declarations) return;
  for (const decl of node.declarations) {
    if (decl.type === ASTType.VariableDeclarator && decl.id) extractDefinedVariables(decl.id, bodyScope);
  }
}

export type INodeScope = Array<IBodyScope>;

export type IBodyScope = Record<string, ASTNode>;

export function newScopeTracker(visitor: IVisit): IBodyScope {
  const { node, parent } = visitor;
  if (node.body) {
    const bodyScope: IBodyScope = {};
    const bodyNodesLength = (node.body as Array<ASTNode>).length;
    let index = 0;

    if (parent) {
      if (parent.param && parent.param.type === ASTType.Identifier) {
        // catch clause
        bodyScope[parent.param.name] = parent.param;
      }

      // function arguments
      if (parent.params) {
        for (const param of parent.params) {
          if (param.type === ASTType.Identifier) bodyScope[param.name] = param;
          if (
            param.type === ASTType.ParameterProperty &&
            param.parameter &&
            param.parameter.type === ASTType.Identifier
          ) {
            bodyScope[param.parameter.name] = param;
          }
        }
      }
    }

    // for loops
    // for (var i = 0; i <= 0; i++) {}
    // should set the body scope
    if (node.type === ASTType.ForStatement && node.init && node.init.type === ASTType.VariableDeclaration) {
      extractDeclarations(node.init, bodyScope);
    }

    while (index < bodyNodesLength) {
      const item = node.body[index];
      const type = item.type;

      // Variable declarations
      // const foo = 1
      if (type === ASTType.VariableDeclaration) {
        // here we just update the existing scope
        extractDeclarations(item, bodyScope);
      }

      // function and class declarations
      if (_FunctionDecl[type]) {
        // Catch the following
        // function foo(){}
        // class Foo {}
        if (item.id && item.id.name) bodyScope[item.id.name] = item;
      }
      index++;
    }

    return bodyScope;
  }
}
