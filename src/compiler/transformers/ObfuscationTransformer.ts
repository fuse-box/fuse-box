import { ITransformer } from '../program/transpileModule';
import { IVisit } from '../Visitor/Visitor';

export function ObfuscationTransformer(): ITransformer {
  return (visit: IVisit) => {
    const { node, parent, property, isLocalIdentifier } = visit;
    if (node.type === 'MethodDefinition') {
      const mapping: any = {};
      if (node.value.params) {
        let counter = 0;
        for (const p of node.value.params) {
          if (p.name !== 'this') {
            const newName = `$${++counter}`;
            mapping[p.name] = newName;
            p.name = newName;
          }
        }
        node.value.body.scope = { locals: {}, meta: { mapping } };
      }
      return;
    }

    const scope = visit.scope;
    if (scope) {
    }

    if (scope && scope.meta && scope.meta.mapping && isLocalIdentifier) {
      if (scope.meta.mapping[node.name]) {
        node.name = scope.meta.mapping[node.name];
      }
    }
  };
}
