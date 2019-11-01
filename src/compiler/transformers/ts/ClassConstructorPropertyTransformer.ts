import { ASTNode } from '../../interfaces/AST';
import { ITransformer } from '../../program/transpileModule';
import { IVisit } from '../../Visitor/Visitor';
import { isValidMethodDefinition, createExpressionStatement } from '../../Visitor/helpers';
import { GlobalContext } from '../../program/GlobalContext';

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
  let classIds = 0;
  return (visit: IVisit) => {
    const { node } = visit;

    let StaticProps: Array<ASTNode>;
    let ClassNode: ASTNode;

    if (
      node.type === 'ClassDeclaration' ||
      (node.type === 'ClassExpression' && !node.$fuse_class_declaration_visited)
    ) {
      if (node.body && (node.body as ASTNode).type === 'ClassBody') {
        const classBody = node.body as ASTNode;
        if (classBody.type === 'ClassBody') {
          const bodyInitializers = [];
          let isConstructorFound = false;
          let hasSuperClass = node.superClass;

          let constructorNode: ASTNode;
          ClassNode = node;

          for (const bodyEl of classBody.body as Array<ASTNode>) {
            if (bodyEl.type === 'ClassProperty' && bodyEl.value) {
              if (bodyEl.static) {
                if (!StaticProps) StaticProps = [];
                StaticProps.push(bodyEl);
              } else {
                bodyInitializers.push({
                  paramName: bodyEl.key.name,
                  computed: bodyEl.computed,
                  ast: bodyEl.value,
                });
              }
            } else if (isValidMethodDefinition(bodyEl) && bodyEl.kind === 'constructor') {
              isConstructorFound = true;
              constructorNode = bodyEl;
            }
          }
          if (bodyInitializers.length) {
            if (!isConstructorFound) {
              const bodyBlockStatement = [];
              if (hasSuperClass) bodyBlockStatement.push(SUPER_WITH_ARGS);
              // injecting constructor if none found
              (classBody.body as Array<ASTNode>).splice(0, 0, {
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
      }
    }

    if (isValidMethodDefinition(node) && node.kind === 'constructor') {
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
                  computed: item.computed === true,
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
    // handle static props
    if (StaticProps) {
      if (!ClassNode.id) ClassNode.id = { type: 'Identifier', name: `_UnnamedClass_${++classIds}` };

      const className = ClassNode.id.name;
      const statements: Array<ASTNode> = [];
      for (const prop of StaticProps) {
        const statement = createExpressionStatement(
          {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: className,
            },
            computed: prop.computed,
            property: {
              type: 'Identifier',
              name: prop.key.name,
            },
          },
          prop.value,
        );
        statements.push(statement);
      }

      if (visit.parent.body) {
        // this is a simple case, where we have body to insert after
        return { insertAfterThisNode: statements };
      } else {
        if (ClassNode.$fuse_class_declaration_visited) return;
        const globalContext = visit.globalContext as GlobalContext;

        // prevent the same transformer from visiting the same node
        // Since we have done all the tranformers, but need to return exactly same CLASS
        // due to a SequenceExpression transformation
        ClassNode.$fuse_class_declaration_visited = true;
        // we need to generate a new variable which will be appened to body
        // e.g var _1_;
        const NewSysVariableName = globalContext.getNextSystemVariable();

        const sequenceExpressions: ASTNode = { type: 'SequenceExpression', expressions: [] };
        const classAssignment: ASTNode = {
          type: 'AssignmentExpression',
          left: { type: 'Identifier', name: NewSysVariableName },
          operator: '=',
          right: ClassNode,
        };
        sequenceExpressions.expressions.push(classAssignment);
        // convert expression statements to AssignmentExpression
        // we also should modify the target object (it's a different variable now)
        for (const oldStatement of statements) {
          oldStatement.expression.left.object.name = NewSysVariableName;
          const n: ASTNode = {
            type: 'AssignmentExpression',
            left: oldStatement.expression.left,
            operator: '=',
            right: oldStatement.expression.right,
          };
          sequenceExpressions.expressions.push(n);
        }
        sequenceExpressions.expressions.push({ type: 'Identifier', name: NewSysVariableName });

        // generate a declaration
        const sysVariableDeclaration: ASTNode = {
          type: 'VariableDeclaration',
          kind: 'var',
          declarations: [
            {
              type: 'VariableDeclarator',
              init: null,
              id: {
                type: 'Identifier',
                name: NewSysVariableName,
              },
            },
          ],
        };

        return { replaceWith: sequenceExpressions, prependToBody: [sysVariableDeclaration] };
      }
    }
  };
}
