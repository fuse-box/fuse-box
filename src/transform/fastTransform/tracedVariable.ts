import { ITransformContext } from './TrasnformContext';
import { createTracedExpression } from '../transformUtils';

export function tracedVariable(ctx: ITransformContext, node, context) {
  if (ctx.tracedImportSpecifiers[node.name] && ctx.tracedImportSpecifiers[node.name].nodes) {
    // variable found in the local scope
    if (context && context.locals.indexOf(node.name) > -1) {
      // we return the node as is, without modifying it
      return node;
    }
    const traced = ctx.tracedImportSpecifiers[node.name];

    // alias usually means a "default" statement. Here we need to create a new Identifier for it
    // otherwise we take the node as is
    return createTracedExpression(traced.local, traced.alias ? { type: 'Identifier', name: traced.alias } : node);
  }
  return node;
}

export function handleTracedImportSpecifiers(ctx: ITransformContext) {
  for (const local in ctx.tracedImportSpecifiers) {
    const item = ctx.tracedImportSpecifiers[local];
    for (const node of item.nodes) {
      if (item.alias) {
        node.node.name = item.alias;
      }

      if (item.replaceWithLocal) {
        node.node.name = item.local;
      } else {
        if (node.idx === undefined) {
          node.parent[node.prop] = createTracedExpression(item.local, node.node);
        } else {
          node.parent[node.prop][node.idx] = createTracedExpression(item.local, node.node);
        }
      }
    }
  }
}
