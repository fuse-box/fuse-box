import { ISchema } from '../../core/nodeSchema';
import { ITransformer } from '../../interfaces/ITransformer';
import { ImportType } from '../../interfaces/ImportType';

export function RequireStatementInterceptor(): ITransformer {
  return {
    commonVisitors: props => {
      return {
        onEach: (schema: ISchema) => {
          const { getLocal, node } = schema;
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
