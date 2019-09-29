import { ASTNode } from '../interfaces/AST';
import { ITransformer } from '../program/transpileModule';
import { IVisit } from '../Visitor/Visitor';

export function ClassConstructorPropertyTransformer(): ITransformer {
  return (visit: IVisit) => {
    const { node } = visit;
    //console.log(scope, node);

    if (node.type === 'MethodDefinition' && node.kind === 'constructor') {
      if (node.value.params) {
        let index = 0;
        let hasSomethingToAdd = false;
        let thisParams = [];
        while (index < node.value.params.length) {
          const param = node.value.params[index] as ASTNode;
          if (param.type === 'ParameterProperty' && param.accessibility) {
            hasSomethingToAdd = true;
            thisParams.push(param.parameter.name);
            node.value.params[index] = { type: 'Identifier', name: param.parameter.name };
          }
          index++;
        }

        if (hasSomethingToAdd) {
          const body = node.value.body.body;
          const firstCallExpression = body[0];
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
          for (const paramName of thisParams) {
            (<Array<ASTNode>>body).splice(insertPosition, 0, {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'MemberExpression',
                  object: { type: 'ThisExpression' },
                  computed: false,
                  property: { type: 'Identifier', name: paramName },
                },
                operator: '=',
                right: { type: 'Identifier', name: paramName },
              },
            });
            insertPosition++;
          }
        }
      }
    }
  };
}
