import { ASTNode } from '../../interfaces/AST';
import { ITransformer } from '../../program/transpileModule';
import { IVisit } from '../../Visitor/Visitor';

const SUPER_WITH_ARGS: ASTNode = {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'Super',
    },
    arguments: [
      {
        type: 'SpreadElement',
        argument: {
          type: 'Identifier',
          name: 'arguments',
        },
      },
    ],
  },
};
export function ClassConstructorPropertyTransformer(): ITransformer {
  return (visit: IVisit) => {
    const { node } = visit;

    if (node.type === 'ClassBody') {
      const bodyInitializers = [];
      let isConstructorFound = false;
      let hasSuperClass = !!visit.parent.superClass;
      let constructorNode: ASTNode;
      for (const bodyEl of node.body as Array<ASTNode>) {
        if (bodyEl.type === 'ClassProperty' && bodyEl.value) {
          bodyInitializers.push({ paramName: bodyEl.key.name, ast: bodyEl.value });
        } else if (bodyEl.type === 'MethodDefinition' && bodyEl.kind === 'constructor') {
          isConstructorFound = true;
          constructorNode = bodyEl;
        }
      }
      if (bodyInitializers.length) {
        if (!isConstructorFound) {
          const bodyBlockStatement = [];
          if (hasSuperClass) bodyBlockStatement.push(SUPER_WITH_ARGS);
          // injecting constructor if none found
          (node.body as Array<ASTNode>).splice(0, 0, {
            type: 'MethodDefinition',
            kind: 'constructor',
            $fuse_classInitializers: bodyInitializers,
            key: {
              type: 'Identifier',
              name: 'constructor',
            },
            value: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: bodyBlockStatement,
              },
            },
          });
        } else constructorNode.$fuse_classInitializers = bodyInitializers;
      }
    }

    if (node.type === 'MethodDefinition' && node.kind === 'constructor') {
      if (node.value.params) {
        let index = 0;
        let hasSomethingToAdd = false;
        let thisParams = [];
        while (index < node.value.params.length) {
          const param = node.value.params[index] as ASTNode;
          if (param.type === 'ParameterProperty') {
            hasSomethingToAdd = true;
            let name;
            if (param.parameter.left) {
              name = param.parameter.left.name;
            } else {
              name = param.parameter.name;
            }
            thisParams.push({ paramName: name, ast: { type: 'Identifier', name } });
          }
          index++;
        }
        if (node.$fuse_classInitializers) {
          hasSomethingToAdd = true;
          thisParams = thisParams.concat(node.$fuse_classInitializers);
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
          for (const item of thisParams) {
            (<Array<ASTNode>>body).splice(insertPosition, 0, {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'MemberExpression',
                  object: { type: 'ThisExpression' },
                  computed: false,
                  property: { type: 'Identifier', name: item.paramName },
                },
                operator: '=',
                right: item.ast,
              },
            });
            insertPosition++;
          }
        }
      }
    }
  };
}
