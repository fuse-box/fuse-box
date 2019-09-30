import { ASTNode } from '../interfaces/AST';

const _isLocalIdentifierRulesExceptionNodes = {
  ImportSpecifier: 1,
  ImportDeclaration: 1,
  ImportNamespaceSpecifier: 1,
  TypeReference: 1,
  FunctionDeclaration: 1,
  ClassDeclaration: 1,
  FunctionExpression: 1,
  ImportDefaultSpecifier: 1,
};
export function isLocalIdentifier(node: ASTNode, parent?: ASTNode) {
  if (node.type === 'Identifier' && parent && !_isLocalIdentifierRulesExceptionNodes[parent.type]) {
    return (parent.computed === true || (parent.property !== node && !parent.computed)) && parent.key !== node;
  }
}

export function isDefinedLocally(node: ASTNode): Array<string> {
  if (node.id && node.id.name) {
    return [node.id.name];
  }
  if (node.type === 'VariableDeclaration') {
    const defined = [];
    if (node.declarations) {
      for (const decl of node.declarations) {
        if (decl.type === 'VariableDeclarator' && decl.id && decl.id.type === 'Identifier') {
          defined.push(decl.id.name);
        }
      }
    }
    return defined;
  }
}

export function createMemberExpression(obj: string, target: string): ASTNode {
  return {
    type: 'MemberExpression',
    object: {
      type: 'Identifier',
      name: obj,
    },
    property: {
      type: 'Identifier',
      name: target,
    },
    computed: false,
  };
}

export function createExpressionStatement(left: ASTNode, right: ASTNode) {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      left: left,
      operator: '=',
      right: right,
    },
  };
}
export function defineVariable(left: string, right: string | ASTNode): ASTNode {
  return {
    type: 'VariableDeclaration',
    kind: 'var',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'Identifier',
          name: left,
        },
        id:
          typeof right === 'string'
            ? {
                type: 'Identifier',
                name: right,
              }
            : right,
      },
    ],
  };
}

export function createLiteral(value): ASTNode {
  return { type: 'Literal', value };
}
export function createExports(exportsKey: string, exportsVariableName: string, property: ASTNode): ASTNode {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: exportsKey,
        },
        computed: false,
        property: {
          type: 'Identifier',
          name: exportsVariableName,
        },
      },
      right: property,
    },
  };
}

export function createRequireStatement(source: string, local?: string): ASTNode {
  const reqStatement: ASTNode = {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: 'require',
    },
    arguments: [
      {
        type: 'Literal',

        value: source,
      },
    ],
  };
  if (!local) {
    return {
      type: 'ExpressionStatement',
      expression: reqStatement,
    };
  }
  return {
    type: 'VariableDeclaration',

    declarations: [
      {
        type: 'VariableDeclarator',

        id: {
          type: 'Identifier',
          name: local,
        },
        init: reqStatement,
      },
    ],
    kind: 'var',
  };
}
