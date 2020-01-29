import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { ITransformer } from '../../interfaces/ITransformer';
import { ImportType } from '../../interfaces/ImportType';

export function RequireStatementInterceptor(): ITransformer {
  return {
    commonVisitors: props => {
      return {
        onEachNode: (visit: IVisit): IVisitorMod => {
          const { node } = visit;
          if (!props.onRequireCallExpression) {
            return;
          }
          if (node.type === 'CallExpression' && node.callee.name === 'require' && !node['emitted']) {
            // broken code for reference (node.name is always undefined)
            // const locals = (visit.scope && visit.scope.locals) || {};
            // if (!locals[node.name]) {
            //   props.onRequireCallExpression(ImportType.REQUIRE, node);
            // }

            props.onRequireCallExpression(ImportType.REQUIRE, node);
          }
          return;
        },
      };
    },
  };
}
