import { ASTNode, ASTType } from '../interfaces/AST';
import { ISchema } from './nodeSchema';

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

export function extractDefinedVariables(schema: ISchema, node: ASTNode, names: Record<string, ISchemaRecord>, isVar: boolean = false) {
  if (node.type === ASTType.Identifier) {
    names[node.name] = { node, schema };
    // if definition with var keyword, lookup to function scope
    if (isVar && schema.parentSchema) {
      let currentParentSchema = schema.parentSchema;
      while (currentParentSchema && currentParentSchema.node
        && currentParentSchema.node.type !== 'FunctionDeclaration'
        && currentParentSchema.node.type !== 'FunctionExpression'
      ) {
        currentParentSchema = currentParentSchema.parentSchema;
      }
      if (currentParentSchema && currentParentSchema.nodeScope.length > 0) {
        // mark to null on function scope ( null means existance of var )
        currentParentSchema.nodeScope[currentParentSchema.nodeScope.length - 1][node.name] = null;
      }
    }
    return;
  }

  if (node.type == ASTType.AssignmentPattern) {
    if (node.left) extractDefinedVariables(schema, node.left, names);
  }

  if (node.type === ASTType.ObjectPattern) {
    for (const property of node.properties) {
      let target = property;
      if (property.type === ASTType.Property) target = property.value;
      extractDefinedVariables(schema, target, names);
    }
  }
  if (node.type === ASTType.ArrayPattern) {
    for (const element of node.elements) {
      if (element) extractDefinedVariables(schema, element, names);
    }
  }

  if (node.type === ASTType.RestElement) {
    return extractDefinedVariables(schema, node.argument, names);
  }
}

function extractDeclarations(schema: ISchema, node: ASTNode, bodyScope: Record<string, ISchemaRecord>) {
  if (!node.declarations) return;
  for (const decl of node.declarations) {
    if (decl.type === ASTType.VariableDeclarator && decl.id) extractDefinedVariables(schema, decl.id, bodyScope, node.kind === 'var');
  }
}

export type INodeScope = Array<IBodyScope>;
export type ISchemaRecord = { node: ASTNode; schema: ISchema };
export type IBodyScope = Record<string, ISchemaRecord>;

export function scopeTracker(schema: ISchema): IBodyScope {
  const { node, parent } = schema;

  // add consequent as target for calculatation of scope
  if (node.body || node.consequent) {
    let body: Array<ASTNode> = Array.from([]);
    if (node.body) {
      if (Array.isArray(node.body)) {
        for (const n of (node.body as Array<ASTNode>)) {
          body.push(n);
        }
      } else {
        body.push(node.body as ASTNode);
      }
    }
    if (node.consequent) {
      if (Array.isArray(node.consequent)) {
        for (const n of (node.consequent as Array<ASTNode>)) {
          body.push(n)
        }
      } else {
        body.push(node.consequent as ASTNode);
      }
    }

    const bodyScope: IBodyScope = {};
    const bodyNodesLength = body.length;

    let index = 0;

    let target = parent;

    if (node.type === 'ArrowFunctionExpression' && node.params) {
      target = node;
    }

    if (target) {
      if (target.param && target.param.type === ASTType.Identifier) {
        // catch clause
        bodyScope[target.param.name] = { node: target.param, schema };
      }

      // function arguments
      if (target.params) {
        for (const param of target.params) {
          if (param.type === ASTType.AssignmentPattern && param.left && param.left.type === ASTType.Identifier) {
            bodyScope[param.left.name] = { node: param, schema };
          } else if (param.type === ASTType.Identifier) bodyScope[param.name] = { node: param, schema };
          else if (
            param.type === ASTType.ParameterProperty &&
            param.parameter &&
            param.parameter.type === ASTType.Identifier
          ) {
            bodyScope[param.parameter.name] = { node: param, schema };
          } else {
            extractDefinedVariables(schema, param, bodyScope);
          }
        }
      }
    }

    // for loops
    // for (var i = 0; i <= 0; i++) {}
    // should set the body scope
    if (node.type === ASTType.ForStatement && node.init && node.init.type === ASTType.VariableDeclaration) {
      extractDeclarations(schema, node.init, bodyScope);
    }
    if (node.type === ASTType.ForInStatement && node.left && node.left.type === ASTType.VariableDeclaration) {
      extractDeclarations(schema, node.left, bodyScope);
    }

    while (index < bodyNodesLength) {
      const item = body[index];

      const type = item.type;

      if (type === ASTType.ImportDeclaration && item.specifiers) {
        for (const specifier of item.specifiers) {
          bodyScope[specifier.local.name] = { node: specifier, schema };
        }
      }

      // Variable declarations
      // const foo = 1
      if (type === ASTType.VariableDeclaration) {
        // here we just update the existing scope
        extractDeclarations(schema, item, bodyScope);
      }

      // function and class declarations
      if (_FunctionDecl[type]) {
        // Catch the following
        // function foo(){}
        // class Foo {}

        if (item.id && item.id.name) bodyScope[item.id.name] = { node: item, schema };
        if (node.params) {
          for (const param of node.params) {
            extractDefinedVariables(schema, param, bodyScope);
          }
        }
      }

      index++;
    }

    return bodyScope;
  }
}
