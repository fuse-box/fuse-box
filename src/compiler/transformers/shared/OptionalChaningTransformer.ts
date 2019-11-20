import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { ASTNode } from '../../interfaces/AST';
import { GlobalContext } from '../../program/GlobalContext';

function buildChainTree(node: ASTNode, list: Array<ASTNode>) {
  // if (node.object.type === 'OptionalExpression') {
  //   if (node.object.object.type === 'Identifier') {
  //     list.unshift(node.object.object);
  //   }
  // }
  if (node.type === 'MemberExpression') {
    list.unshift(node);
    return list;
  }
  if (node.object.type === 'Identifier') {
    
    list.unshift(node);
    return list;
  } else {
    list.unshift(node);
    buildChainTree(node.object, list);
  }
}

function moveChain(chain: ASTNode, expression?: ASTNode): ASTNode {
  if (!chain.base) {
    return chain.property;
  }
  if (!expression) expression = { type: 'MemberExpression' };
  expression.property = chain.property;
  expression.computed = chain.computed;
  expression.object = moveChain(chain.base);

  return expression;
}

function conver2MemberExpression(node: ASTNode) {
  if (node.chain) {
    let chain = node.chain;
    return moveChain(chain);
  }

  return node;
}

function createConditionalExpression(sysName: string) {
  // prevMember.test.left.left.right
  // prevMement.alternate.property
  const node: ASTNode = {
    type: 'ConditionalExpression',
    test: {
      type: 'LogicalExpression',
      left: {
        type: 'BinaryExpression',
        left: {
          type: 'AssignmentExpression',
          left: {
            type: 'Identifier',
            name: sysName,
          },
          operator: '=',
          right: null,
        },
        right: {
          type: 'Literal',
          value: null,
        },
        operator: '===',
      },
      right: {
        type: 'BinaryExpression',
        left: {
          type: 'Identifier',
          name: sysName,
        },
        right: {
          type: 'UnaryExpression',
          operator: 'void',
          argument: {
            type: 'Literal',
            value: 0,
          },
          prefix: true,
        },
        operator: '===',
      },
      operator: '||',
    },
    consequent: {
      type: 'UnaryExpression',
      operator: 'void',
      argument: {
        type: 'Literal',
        value: 0,
      },
      prefix: true,
    },
    alternate: {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: sysName,
      },
      computed: false,
      property: null,
    },
  };
  return node;
}

export function OptionalChaningTransformer(options?: ITransformerSharedOptions) {
  options = options || {};
  return (visit: IVisit): IVisitorMod => {
    const node = visit.node;

    if (node.type === 'OptionalExpression') {
      const globalContext = visit.globalContext as GlobalContext;
      const list: Array<ASTNode> = [];

      buildChainTree(node, list);

      let length = list.length;
      let index = 0;
      let prevMember: ASTNode;

      let childExpression: ASTNode;
      while (index < length) {
        const item = list[index];
        if (item.object && item.object.type === 'Identifier' && item.type !== 'MemberExpression') {
          // this is the first one
          const nextVar = globalContext.getNextSystemVariable();
          prevMember = createConditionalExpression(nextVar);
          prevMember.test.left.left.right = item.object;
          childExpression = prevMember;
        }

        const member = conver2MemberExpression(item);
        if (!childExpression) {
          const nextVar = globalContext.getNextSystemVariable();
          prevMember = createConditionalExpression(nextVar);
          prevMember.test.left.left.right = member;
          childExpression = prevMember;
        } else {
          if (prevMember) {
            prevMember.alternate.property = member;
            prevMember = undefined;
          } else {
            const nextVar = globalContext.getNextSystemVariable();
            const newExpression = createConditionalExpression(nextVar);
            newExpression.test.left.left.right = childExpression;
            newExpression.alternate.property = member;
            console.log('member', member, item);
            childExpression = newExpression;
          }
        }

        index++;
      }

      return { ignoreChildren: true, replaceWith: childExpression };
    }
    return;
  };
}
