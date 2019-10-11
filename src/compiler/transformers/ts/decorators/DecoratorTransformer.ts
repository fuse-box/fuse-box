import { ASTNode } from '../../../interfaces/AST';
import { ITransformer } from '../../../program/transpileModule';
import {
  createClassDecorators,
  createPropertyDecorator,
  createMethodDecorator,
  createMethodPropertyDecorator,
  createMethodArgumentParam,
} from '../../../Visitor/decorator_helpers';
import { createRequireStatement } from '../../../Visitor/helpers';
import { IVisit, IVisitorMod } from '../../../Visitor/Visitor';
import { ITransformerSharedOptions } from '../../../interfaces/ITransformerSharedOptions';
import { ImportType } from '../../../interfaces/ImportType';

export interface IDecoratorTransformerOpts {
  helperModule?: string;
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
        statements.push(statement);
      }

      // decorate properties
      for (const item of targetClassBody) {
        if (item.decorators && item.decorators.length) {
          const expressions: Array<ASTNode> = [];
          for (const dec of item.decorators) {
            expressions.push(dec.expression);
          }
          if (item.type === 'ClassProperty') {
            statements.push(
              createPropertyDecorator({
                helperModule: opts.helperModule,
                className: className,
                propertyName: item.key.name,
                decorators: expressions,
              }),
            );
          } else if (item.type === 'MethodDefinition') {
            statements.push(
              createMethodDecorator({
                helperModule: opts.helperModule,
                className: className,
                isStatic: item.static,
                methodName: item.key.name,
                decorators: expressions,
              }),
            );
          }
        }

        if (item.type === 'MethodDefinition') {
          if (item.value && item.value.type === 'FunctionExpression') {
            const params = item.value.params as Array<ASTNode>;

            if (params && params.length) {
              let index = 0;
              const paramDecors = [];
              while (index < params.length) {
                let p = params[index];
                if (p.decorators && p.decorators.length) {
                  for (const dec of p.decorators) {
                    paramDecors.push(
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
              if (paramDecors.length) {
                statements.push(
                  createMethodPropertyDecorator({
                    isStatic: item.static,
                    helperModule: opts.helperModule,
                    className: className,
                    methodName: item.key.name,
                    index: index,
                    elements: paramDecors,
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
