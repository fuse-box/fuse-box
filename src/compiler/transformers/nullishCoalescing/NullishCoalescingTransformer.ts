import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { createUndefinedVariable, createVariableDeclaration } from '../../helpers/astHelpers';
import { ASTNode, ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { GlobalContext } from '../../program/GlobalContext';

export function createNullishStatement(props: ILocalContext) {
  const { genId, globalContext } = props;
  const expr: ASTNode = {
    expression: {
      alternate: undefined,
      consequent: undefined,
      test: {
        left: {
          left: undefined,
          operator: '!==',
          right: {
            type: 'Literal',
            value: null,
          },
          type: 'BinaryExpression',
        },
        operator: '&&',
        right: {
          left: undefined,
          operator: '!==',
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
    },
    type: 'ExpressionStatement',
  };
  return {
    expression: expr,
    setCondition: (node: ASTNode) => {
      // simple identifiers
      if (node.type === ASTType.Identifier) {
        expr.expression.consequent = node;
        expr.expression.test.left.left = node;
        expr.expression.test.right.left = node;
      } else {
        const sysVariable = genId();
        const target = { name: sysVariable, type: ASTType.Identifier };
        expr.expression.test.left.left = {
          left: target,
          operator: '=',
          right: node,
          type: 'AssignmentExpression',
        };
        expr.expression.test.right.left = target;
        expr.expression.consequent = target;
      }
    },
    setRight: (node: ASTNode) => {
      expr.expression.alternate = node;
    },
  };
}

function isNullishCoalescing(node: ASTNode) {
  return node.type === ASTType.LogicalExpression && node.operator === '??';
}

function drillExpressions(node: ASTNode, nodes: Array<ASTNode>) {
  if (!isNullishCoalescing(node)) return;
  nodes.unshift(node);
  if (node.left) drillExpressions(node.left, nodes);
}

interface ILocalContext {
  globalContext: GlobalContext;
  genId?: () => string;
}

export function NullishCoalescingTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      return {
        onEachNode: (visit: IVisit): IVisitorMod => {
          const { node } = visit;

          const nodes: Array<ASTNode> = [];
          if (!isNullishCoalescing(node)) return;
          const globalContext = visit.globalContext as GlobalContext;
          drillExpressions(node, nodes);

          const startingNode = nodes[0];
          const declaration = createVariableDeclaration();

          const ctx: ILocalContext = {
            globalContext,
            genId: () => {
              const nextVar = globalContext.getNextSystemVariable();
              declaration.declarations.push(createUndefinedVariable(nextVar));
              return nextVar;
            },
          };

          let pointer = createNullishStatement(ctx);
          pointer.setRight(startingNode.right);
          pointer.setCondition(startingNode.left);
          let index = 1;
          while (index < nodes.length) {
            const item = nodes[index];
            const newPointer = createNullishStatement(ctx);
            newPointer.setRight(item.right);
            newPointer.setCondition(pointer.expression.expression);
            pointer = newPointer;
            index++;
          }
          let prepend: Array<ASTNode> = [];
          if (declaration.declarations.length) prepend = [declaration];

          return { prependToBody: prepend, replaceWith: pointer.expression.expression };
        },
      };
    },
  };
}
