import { ITransformContext } from './TrasnformContext';
import { createMemberExpression } from '../transformUtils';

export function handleExportSpecifiers(ctx: ITransformContext, node, parent, prop, idx) {
  if (node.source) {
    const name = ctx.generateName();
    if (node.source.type === 'Literal') {
      ctx.reqStatements.push({ local: name, source: node.source.value });
    }
    node.specifiers.forEach(specifier => {
      ctx.exported.push({
        exported: specifier.exported.name,
        local: createMemberExpression(name, specifier.local.name),
      });
    });
  } else {
    // export { name1, name2}
    node.specifiers.forEach(specifier => {
      let replacement = specifier.local.name;
      if (ctx.tracedImportSpecifiers[specifier.local.name]) {
        const traced = ctx.tracedImportSpecifiers[specifier.local.name];

        replacement = createMemberExpression(traced.local, traced.alias ? traced.alias : specifier.local.name);
      }
      ctx.exported.push({ local: replacement, exported: specifier.exported.name });
    });
  }
  if (prop && idx !== undefined) {
    ctx.toRemove(parent[prop], node);
  }
}
