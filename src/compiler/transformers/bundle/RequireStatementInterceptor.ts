import { BUNDLE_RUNTIME_NAMES } from '../../../bundleRuntime/bundleRuntimeCore';
import { ISchema } from '../../core/nodeSchema';
import { ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { ImportType } from '../../interfaces/ImportType';

export function RequireStatementInterceptor(): ITransformer {
  return {
    commonVisitors: props => {
      return {
        onEach: (schema: ISchema) => {
          const { getLocal, localIdentifier, node, parent, replace } = schema;

          if (localIdentifier) {
            if (node.name === 'require' && parent.type !== ASTType.CallExpression) {
              if (getLocal(node.name)) return;
              return replace({ name: BUNDLE_RUNTIME_NAMES.ARG_REQUIRE_FUNCTION, type: 'Identifier' });
            }
          }

          // handle typeof
          if (node.operator === 'typeof' && node.type === ASTType.UnaryExpression) {
            if (node.argument && node.argument.name) {
              const name = node.argument.name;
              // we must preserve local variable
              if (name === 'require') {
                if (getLocal(name)) return;
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
