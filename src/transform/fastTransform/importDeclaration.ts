import { ITransformContext } from './TrasnformContext';
import { createMemberExpression } from '../transformUtils';

export function onImportDeclaration(ctx: ITransformContext, node, parent, prop, idx) {
  const source = node.source.value;
  const localName = ctx.generateName();
  const localVariables: Array<{ local: any; exported: any }> = [];

  const opts: any = {
    replaceNode: { array: parent[prop], node },
    source: source,
    localVariables,
  };

  if (node.specifiers.length > 0) {
    opts.local = localName;
  }
  ctx.reqStatements.push(opts);
  node.specifiers.forEach(specifier => {
    if (specifier.type === 'ImportSpecifier') {
      ctx.tracedImportSpecifiers[specifier.local.name] = {
        alias: specifier.imported.name,
        local: localName,
        nodes: [],
      };
      localVariables.push({
        exported: specifier.local.name,
        local: createMemberExpression(localName, specifier.imported.name),
      });
    } else if (specifier.type === 'ImportDefaultSpecifier') {
      ctx.tracedImportSpecifiers[specifier.local.name] = { alias: 'default', local: localName, nodes: [] };

      localVariables.push({
        exported: specifier.local.name,
        local: createMemberExpression(localName, 'default'),
      });
    } else if (specifier.type === 'ImportNamespaceSpecifier') {
      ctx.tracedImportSpecifiers[specifier.local.name] = { replaceWithLocal: true, local: localName, nodes: [] };
      localVariables.push({
        exported: specifier.local.name,
        local: {
          type: 'Identifier',
          name: localName,
        },
      });
    }
  });
}
