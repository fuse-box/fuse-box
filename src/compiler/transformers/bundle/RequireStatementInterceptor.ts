import { ImportType } from '../../interfaces/ImportType';
import { ITransformer } from '../../interfaces/ITransformer';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';

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
            const locals = visit.scope && visit.scope.locals ? visit.scope.locals : {};
            if (!locals[node.name]) {
              props.onRequireCallExpression(ImportType.REQUIRE, node);
            }
          }
          return;
        },
      };
    },
  };
}
