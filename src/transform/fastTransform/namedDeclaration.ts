import { ITransformContext } from './TrasnformContext';
import { tracedVariable } from './tracedVariable';
import { handleExportSpecifiers } from './exportSpecifiers';

export function exportNamedDeclaration(ctx: ITransformContext, node, parent, prop, idx, context) {
  if (node.declaration) {
    const type = node.declaration.type;
    // export const foobar = 1, foo = 3, some = class {}
    let removed = 0;
    if (type === 'VariableDeclaration') {
      const declarations = node.declaration.declarations;
      declarations.map(declaration => {
        if (declaration.id && declaration.id.name) {
          if (!declaration.init) {
            removed++;
            ctx.undefinedExports.push(declaration.id.name);

            ctx.toRemove(declarations, declaration);
          } else {
            const name = declaration.id.name;
            if (prop && idx !== undefined) {
              if (Array.isArray(parent[prop])) {
                parent[prop][idx] = tracedVariable(ctx, node.declaration, context);
                ctx.slicedExports.push({
                  afterNode: node.declaration,
                  body: parent[prop],
                  exported: name,
                  local: name,
                });
              }
            }
          }
        }
      });

      node.type = 'VariableDeclaration';
      node.declarations = node.declaration.declarations;
      node.kind = node.declaration.kind;
      // remove the entire declaration if there nothing there after removal
      if (node.declarations.length - removed === 0) {
        ctx.toRemove(parent[prop], node);
      }
    }

    // export function/class
    if (type === 'FunctionDeclaration' || type === 'ClassDeclaration') {
      if (node.declaration.id) {
        const name = node.declaration.id.name;
        if (prop && idx !== undefined) {
          if (Array.isArray(parent[prop])) {
            parent[prop][idx] = tracedVariable(ctx, node.declaration, context); //1
            ctx.slicedExports.push({ afterNode: node.declaration, body: parent[prop], exported: name, local: name });
          }
        }
      }
    }
  }
  if (node.specifiers && node.specifiers.length) {
    handleExportSpecifiers(ctx, node, parent, prop, idx);
  }
}
