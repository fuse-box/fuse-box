import { ASTNode, ASTType } from '../../interfaces/AST';

export function ensureExpressionConsistency(expression: ASTNode, node?: ASTNode) {
  if (node.type == ASTType.Literal) {
    expression.computed = true;
  }
}

export function convertToCallExpression(alternate: ASTNode, id, args): ASTNode {
  return {
    arguments: args,
    callee: { object: { name: id, type: 'Identifier' }, property: alternate, type: 'MemberExpression' },
    type: 'CallExpression',
  };
}

export type OptionalChainHelper = ReturnType<typeof createOptionalChaningExpression>;
export function createOptionalChaningExpression(userId: string) {
  // prevMember.test.left.left.right

  // prevMement.alternate.property
  const AST_NODE: ASTNode = {
    alternate: null,
    consequent: {
      argument: {
        type: 'Literal',
        value: 0,
      },
      operator: 'void',
      prefix: true,
      type: 'UnaryExpression',
    },
    test: {
      left: {
        left: {
          left: {
            name: userId,
            type: 'Identifier',
          },
          operator: '=',
          right: null,
          type: 'AssignmentExpression',
        },
        operator: '===',
        right: {
          type: 'Literal',
          value: null,
        },
        type: 'BinaryExpression',
      },
      operator: '||',
      right: {
        left: {
          name: userId,
          type: 'Identifier',
        },
        operator: '===',
        right: {
          argument: {
            type: 'Literal',
            value: 0,
          },
          operator: 'void',
          prefix: true,
          type: 'UnaryExpression',
        },
        type: 'BinaryExpression',
      },
      type: 'LogicalExpression',
    },
    type: 'ConditionalExpression',
  };

  return {
    id: userId,
    statement: AST_NODE,
    setLeft: (item: ASTNode) => {
      AST_NODE.test.left.left.right = item;
    },
    setRight: (item: ASTNode) => {
      AST_NODE.alternate = item;
    },
  };
}
