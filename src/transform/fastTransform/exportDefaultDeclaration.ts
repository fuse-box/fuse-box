import { ITransformContext } from './TrasnformContext';
import { tracedVariable } from './tracedVariable';
import { createModuleExports } from '../transformUtils';

export function handleExportDefaultDeclaration(ctx: ITransformContext, node, parent, prop, idx, context) {
  if (prop && idx !== undefined) {
    if (Array.isArray(parent[prop])) {
      if (node.declaration && node.declaration.id && node.declaration.id.name) {
        const name = node.declaration.id.name;
        parent[prop][idx] = node.declaration; //2
        ctx.exported.push({
          exported: 'default',
          local: name,
        });
      } else {
        // handle the case:
        // expert default { foo, bar }
        if (node.declaration.type === 'ObjectExpression' && node.declaration.properties) {
          for (const propType of node.declaration.properties) {
            if (propType.value) {
              propType.value = tracedVariable(ctx, propType.value, context);
              if (propType.value.type !== 'Identifier') {
                propType.shorthand = false;
              }
            }
          }
        }
        if (node.declaration.type === 'Identifier') {
          parent[prop][idx] = createModuleExports('default', tracedVariable(ctx, node.declaration, context));
        } else {
          parent[prop][idx] = createModuleExports('default', node.declaration);
        }
      }
    }
  }
}
