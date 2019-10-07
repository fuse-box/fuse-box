import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { ASTNode } from '../../interfaces/AST';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { ImportType } from '../../interfaces/ImportType';

export function DynamicImportTransformer(options?: ITransformerSharedOptions) {
  options = options || {};
  return (visit: IVisit): IVisitorMod => {
    const node = visit.node;
    if (node.type === 'ImportExpression') {
      const requireCallExpression: ASTNode = {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'require',
        },
        arguments: [
          {
            type: 'Literal',
            value: node.source.value,
          },
        ],
      };

      if (options.onRequireCallExpression) {
        options.onRequireCallExpression(ImportType.DYNAMIC, requireCallExpression);
      }

      const callExpression: ASTNode = {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          object: {
            type: 'CallExpression',
            callee: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'Promise',
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'resolve',
              },
            },
            arguments: [],
          },
          computed: false,
          property: {
            type: 'Identifier',
            name: 'then',
          },
        },
        arguments: [
          {
            type: 'ArrowFunctionExpression',
            body: requireCallExpression,
            params: [],
            async: false,
            expression: true,
          },
        ],
      };
      return {
        replaceWith: callExpression,
      };
    }
    return;
  };
}
