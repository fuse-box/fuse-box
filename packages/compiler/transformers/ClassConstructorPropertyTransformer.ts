import { ASTNode } from '../interfaces/AST';
import { ITransformer } from '../program/transpileModule';
import { IVisit } from '../Visitor/Visitor';

export function ClassConstructorPropertyTransformer(): ITransformer {
  let parameters: Array<string> = [];
  return (visit: IVisit) => {
    const node = visit.node;

    switch (node.type) {
      case 'ParameterProperty':
        // filter for parameters with an accessibility modifier (private, protected, public)

        if (node.parameter.left) {
          parameters.push(node.parameter.left.name);
        } else {
          parameters.push(node.parameter.name);
          // remember it for fast iteration in constructor BlockStatement
        }
        return {
          replaceWith: node.parameter,
        };

      case 'BlockStatement':
        // value > 0 makes sure it is the first block statement (constructor block)
        // and that there is AST mutation work to do (add initialization assignments)
        if (!parameters.length) return;

        const firstCallExpression = node.body[0];

        // usually add assignments at first, except there is a super() call
        let insertPosition = 0;

        if (
          firstCallExpression &&
          firstCallExpression.expression &&
          firstCallExpression.expression.callee &&
          firstCallExpression.expression.callee.type === 'Super'
        ) {
          // start injecting initializations at pos. 1 because super() call
          // must always be the first call
          insertPosition = 1;
        }

        for (let parameterName of parameters) {
          (<Array<ASTNode>>node.body).splice(insertPosition, 0, {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'MemberExpression',
                object: { type: 'ThisExpression' },
                computed: false,
                property: { type: 'Identifier', name: parameterName },
              },
              operator: '=',
              right: { type: 'Identifier', name: parameterName },
            },
          });
          insertPosition++;
        }
        // reset the state so transformation doesn't happen
        // in other BlockStatements
        parameters = [];
    }
  };
}
