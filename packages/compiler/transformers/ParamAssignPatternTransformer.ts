import { ASTNode } from '../interfaces/AST';
import { ITransformer } from '../program/transpileModule';
import { IVisit } from '../Visitor/Visitor';

export function ParamAssignPatternTransformer(): ITransformer {
  return (visit: IVisit) => {
    const { node, parent } = visit;
    const type = node.type;
    const isConstructor = parent && parent.type === 'MethodDefinition' && parent.kind === 'constructor';

    const isFunctionExpression = type === 'FunctionExpression';
    const isFunctionDeclaration = type === 'FunctionDeclaration';
    if (isFunctionExpression || isFunctionDeclaration) {
      let shift = 0;
      // body can be different for functions and
      let body: Array<ASTNode>;
      if (isFunctionDeclaration) {
        body = (node.body as ASTNode).body as Array<ASTNode>;
      } else body = parent.value.body.body;
      let index = 0;
      while (index < node.params.length) {
        const param = node.params[index];
        if (param.type === 'AssignmentPattern') {
          const name = param.left.name;

          body.splice(shift, 0, {
            type: 'IfStatement',
            test: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: name,
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
            consequent: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: name,
                    },
                    operator: '=',
                    right: param.right,
                  },
                },
              ],
            },
            alternate: null,
          });
          shift++;
          node.params[index] = param.left;
        }
        index++;
      }
    }
  };
}
