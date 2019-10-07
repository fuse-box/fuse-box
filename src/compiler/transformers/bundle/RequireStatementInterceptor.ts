import { ImportType } from '../../interfaces/ImportType';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';

export function RequireStatementInterceptor(options: ITransformerSharedOptions) {
  options = options || {};
  return (visit: IVisit): IVisitorMod => {
    const { node } = visit;
    if (!options.onRequireCallExpression) {
      return;
    }

    if (node.type === 'CallExpression' && node.callee.name === 'require' && !node['emitted']) {
      const locals = visit.scope && visit.scope.locals ? visit.scope.locals : {};
      if (!locals[node.name]) {
        options.onRequireCallExpression(ImportType.REQUIRE, node);
      }
    }
    return;
  };
}
