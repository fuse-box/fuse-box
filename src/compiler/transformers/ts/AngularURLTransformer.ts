import { ISchema } from '../../core/nodeSchema';
import { createRequireCallExpression } from '../../helpers/helpers';
import { ASTNode } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { ImportType } from '../../interfaces/ImportType';

const PropKeys = { styleUrls: 'styles', templateUrl: 'template' };

export function AngularURLTransformer(test: RegExp): ITransformer {
  return {
    target: { test: test },
    commonVisitors: props => {
      return {
        onEach: (schema: ISchema) => {
          const { node } = schema;
          if (node.type === 'Property') {
            if (PropKeys[node.key.name]) {
              const value = node.value as ASTNode;
              let keyTransformRequired = false;
              // transform styleUrls
              if (value.type === 'ArrayExpression') {
                let i = 0;
                while (i < value.elements.length) {
                  const el = value.elements[i] as ASTNode;
                  if (el.type === 'Literal') {
                    keyTransformRequired = true;
                    const req = createRequireCallExpression([{ type: 'Literal', value: el.value }]);

                    // emit require statement
                    if (props.onRequireCallExpression) {
                      props.onRequireCallExpression(ImportType.REQUIRE, req, { breakDependantsCache: true });
                    }
                    value.elements[i] = req;
                  }
                  i++;
                }
              }
              // transform templateUrl
              else if (value.type === 'Literal') {
                keyTransformRequired = true;
                node.value = createRequireCallExpression([value]);

                // emit require statement
                if (props.onRequireCallExpression) props.onRequireCallExpression(ImportType.REQUIRE, node.value);
              }
              if (keyTransformRequired) node.key.name = PropKeys[node.key.name];
            }
          }
          return;
        },
      };
    },
  };
}
