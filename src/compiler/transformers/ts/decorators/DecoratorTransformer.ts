import { ISchema } from '../../../core/nodeSchema';
import { createRequireStatement, isValidMethodDefinition } from '../../../helpers/helpers';
import { ASTNode } from '../../../interfaces/AST';
import { ITransformer } from '../../../interfaces/ITransformer';
import { ImportType } from '../../../interfaces/ImportType';
import { getParamTypes, getPropertyMetadata } from './Metadata';
import {
  collectDecorators,
  createClassDecorators,
  createMethodMetadata,
  createMethodPropertyDecorator,
  createPropertyDecorator,
  IClassDecorator,
} from './decorator_helpers';

export interface IDecoratorTransformerOpts {
  emitDecoratorMetadata?: boolean;
  helperModule?: string;
}

export function DecoratorTransformer(): ITransformer {
  const helperModule = '__fuse_decorate';
  return {
    target: { type: 'ts' },
    commonVisitors: props => {
      let helperInserted = false;

      const {
        transformationContext: { compilerOptions },
      } = props;

      if (!compilerOptions.experimentalDecorators) return;

      const emitDecoratorMetadata = compilerOptions.emitDecoratorMetadata;

      return {
        onEach: (schema: ISchema) => {
          const { node, replace } = schema;

          let targetClassBody: Array<ASTNode>;
          let className;
          if (node.$fuse_decoratorsProcessed) return;

          if (node.$fuse_decoratorForClassIdentifier) {
            node.$fuse_decoratorsProcessed = true;
            className = node.$fuse_decoratorForClassIdentifier;
            if (node.decorators && node.decorators.length) {
              const assumedDeclaration = node.declarations[0];
              if (assumedDeclaration.init && assumedDeclaration.init.type === 'ClassDeclaration') {
                assumedDeclaration.init.$fuse_decoratorsCaptured = true;
                targetClassBody = (assumedDeclaration.init.body as ASTNode).body as Array<ASTNode>;
              }
            }
          } else if (node.type === 'ClassDeclaration' && !node.$fuse_decoratorsCaptured) {
            node.$fuse_decoratorsProcessed = true;
            className = node.id.name;
            targetClassBody = (node.body as ASTNode).body as Array<ASTNode>;
          }
          if (targetClassBody) {
            let classDecoratorArrayExpression: ASTNode;
            const statements: Array<ASTNode> = [];
            /**
             * Class Decorators
             *  @sealed
             *   export class Hello {
             *    second: string;
             *  }
             *
             */
            let classDecorator: IClassDecorator;
            if (node.decorators && node.decorators.length) {
              const expressions: Array<ASTNode> = [];
              for (const dec of node.decorators) {
                expressions.push(dec.expression);
              }

              classDecorator = createClassDecorators({
                className: className,
                decorators: expressions,
                helperModule: helperModule,
              });
              //statements.push(classDecorator.expressionStatement);

              // check for metadata
              if (emitDecoratorMetadata) {
                classDecoratorArrayExpression = classDecorator.arrayExpression;
              }
            }

            // decorate properties
            for (const item of targetClassBody) {
              if (item.kind === 'constructor' && isValidMethodDefinition(item)) {
                const params = item.value.params as Array<ASTNode>;
                // special treatment for constructor params
                if (params && params.length) {
                  let constructorDecorators: Array<ASTNode> = [];
                  collectDecorators({
                    expressions: constructorDecorators,
                    helperModule: helperModule,
                    params,
                  });
                  if (constructorDecorators.length) {
                    if (!classDecoratorArrayExpression) {
                      classDecorator = createClassDecorators({
                        className: className,
                        decorators: [],
                        helperModule: helperModule,
                      });
                      //statements.push(classDecorator.expressionStatement);
                      classDecoratorArrayExpression = classDecorator.arrayExpression;
                    }
                    for (const exp of constructorDecorators) {
                      classDecoratorArrayExpression.elements.push(exp);
                    }
                  }
                }
                if (classDecoratorArrayExpression) {
                  classDecoratorArrayExpression.elements.push(getParamTypes(item.value as ASTNode));
                }
              }
              if (item.decorators && item.decorators.length) {
                const expressions: Array<ASTNode> = [];
                for (const dec of item.decorators) {
                  expressions.push(dec.expression);
                }
                if (item.type === 'ClassProperty') {
                  expressions.push(getPropertyMetadata(item.typeAnnotation));

                  statements.push(
                    createPropertyDecorator({
                      className: className,
                      decorators: expressions,
                      helperModule: helperModule,
                      propertyName: item.key.name,
                    }),
                  );
                }
              }

              if (isValidMethodDefinition(item)) {
                const params = item.value.params as Array<ASTNode>;
                if (item.value && item.value.type === 'FunctionExpression') {
                  if (item.kind !== 'constructor') {
                    const expressions = [];

                    if (item.decorators && item.decorators.length) {
                      for (const methodDecorator of item.decorators) {
                        expressions.push(methodDecorator.expression);
                      }
                    }

                    if (params && params.length) {
                      collectDecorators({ expressions, helperModule: helperModule, params });
                    }
                    if (expressions.length) {
                      // method decorators metadata
                      if (emitDecoratorMetadata) {
                        const medatadata = createMethodMetadata({ node: item });
                        expressions.push(medatadata.designType);
                        expressions.push(medatadata.paramTypes);
                        expressions.push(medatadata.returnType);
                      }
                      statements.push(
                        createMethodPropertyDecorator({
                          className: className,
                          helperModule: helperModule,
                          isStatic: item.static,
                          methodName: item.key.name,

                          elements: expressions,
                        }),
                      );
                    }
                  }
                }
              }
            }

            if (classDecorator) {
              statements.push(classDecorator.expressionStatement);
            }

            if (statements.length) {
              replace([node].concat(statements));
              if (!helperInserted) {
                helperInserted = true;
                const helper = createRequireStatement('fuse_helpers_decorate', helperModule);
                if (props.onRequireCallExpression)
                  props.onRequireCallExpression(ImportType.REQUIRE, helper.reqStatement);

                schema.bodyPrepend([helper.statement]);
              }
              return schema;
            }
          }
        },
      };
    },
  };
}
