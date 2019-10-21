import { ASTNode } from '../../../interfaces/AST';
import { ImportType } from '../../../interfaces/ImportType';
import { ITransformerSharedOptions } from '../../../interfaces/ITransformerSharedOptions';
import { ITransformer } from '../../../program/transpileModule';
import { createRequireStatement, isValidMethodDefinition } from '../../../Visitor/helpers';
import { IVisit, IVisitorMod } from '../../../Visitor/Visitor';
import {
  createClassDecorators,
  createMethodArgumentParam,
  createMethodMetadata,
  createMethodPropertyDecorator,
  createPropertyDecorator,
} from './decorator_helpers';
import { getParamTypes, getPropertyMetadata } from './Metadata';

export interface IDecoratorTransformerOpts {
  helperModule?: string;
  emitDecoratorMetadata?: boolean;
}
export function DecoratorTransformer(opts?: IDecoratorTransformerOpts & ITransformerSharedOptions): ITransformer {
  opts = opts || {};
  if (!opts.helperModule) {
    opts.helperModule = '__fuse_decorate';
  }
  let helperInserted = false;
  return (visit: IVisit) => {
    const { node } = visit;

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
      if (node.decorators && node.decorators.length) {
        const expressions: Array<ASTNode> = [];
        for (const dec of node.decorators) {
          expressions.push(dec.expression);
        }

        const statement = createClassDecorators({
          helperModule: opts.helperModule,
          className: className,
          decorators: expressions,
        });
        statements.push(statement.expressionStatement);

        // check for metadata
        if (opts.emitDecoratorMetadata) {
          classDecoratorArrayExpression = statement.arrayExpression;
        }
      }

      // decorate properties
      for (const item of targetClassBody) {
        if (item.kind === 'constructor' && isValidMethodDefinition(item)) {
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
                helperModule: opts.helperModule,
                className: className,
                propertyName: item.key.name,
                decorators: expressions,
              }),
            );
          }
        }

        if (isValidMethodDefinition(item) && item.kind !== 'constructor') {
          if (item.value && item.value.type === 'FunctionExpression') {
            const params = item.value.params as Array<ASTNode>;
            const expressions = [];

            if (item.decorators && item.decorators.length) {
              for (const methodDecorator of item.decorators) {
                expressions.push(methodDecorator.expression);
              }
            }

            if (params && params.length) {
              let index = 0;
              while (index < params.length) {
                let p = params[index];
                if (p.decorators && p.decorators.length) {
                  for (const dec of p.decorators) {
                    expressions.push(
                      createMethodArgumentParam({
                        helperModule: opts.helperModule,
                        decorator: dec.expression,
                        index: index,
                      }),
                    );
                  }
                }
                index++;
              }
              if (expressions.length) {
                // method decorators metadata
                if (opts.emitDecoratorMetadata) {
                  const medatadata = createMethodMetadata({ node: item });
                  expressions.push(medatadata.designType);
                  expressions.push(medatadata.paramTypes);
                  expressions.push(medatadata.returnType);
                }
                statements.push(
                  createMethodPropertyDecorator({
                    isStatic: item.static,
                    helperModule: opts.helperModule,
                    className: className,
                    methodName: item.key.name,
                    index: index,
                    elements: expressions,
                  }),
                );
              }
            }
          }
        }
      }

      const mod: IVisitorMod = {};
      if (statements.length) {
        mod.replaceWith = [node].concat(statements);
        if (!helperInserted) {
          helperInserted = true;
          const helper = createRequireStatement('fuse_helpers_decorate', opts.helperModule);
          if (opts.onRequireCallExpression) opts.onRequireCallExpression(ImportType.REQUIRE, helper.reqStatement);
          mod.prependToBody = [helper.statement];
        }
        return mod;
      }
    }
  };
}
