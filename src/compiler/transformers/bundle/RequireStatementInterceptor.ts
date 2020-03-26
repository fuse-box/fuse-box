import { ISchema } from '../../core/nodeSchema';
import { ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { ImportType } from '../../interfaces/ImportType';

export function RequireStatementInterceptor(): ITransformer {
  return {
    commonVisitors: props => {
      return {
        onEach: (schema: ISchema) => {
          const { getLocal, node, replace } = schema;

          // handle typeof
          if (node.operator === 'typeof' && node.type === ASTType.UnaryExpression) {
            if (node.argument && node.argument.name) {
              const name = node.argument.name;
              // we must preserve local variable
              if (getLocal(name)) return;
              switch (name) {
                case 'require':
                  return replace({ type: 'Literal', value: 'function' });
              }
            }
          }

          if (!props.onRequireCallExpression) return;

          if (node.type === 'CallExpression' && node.callee.name === 'require' && !node['emitted']) {
            if (!getLocal('require')) props.onRequireCallExpression(ImportType.REQUIRE, node);
          }
          return;
        },
      };
    },
  };
}
