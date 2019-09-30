import { GlobalContext } from '../program/GlobalContext';
import { createMemberExpression, isLocalIdentifier } from '../Visitor/helpers';
import { IVisit, IVisitorMod } from '../Visitor/Visitor';

export function GlobalContextTransformer() {
  return (visit: IVisit): IVisitorMod => {
    const node = visit.node;
    const global = visit.globalContext as GlobalContext;

    if (node.type === 'TypeAnnotation') {
      return { ignoreChildren: true };
    }
    const locals = visit.scope && visit.scope.locals ? visit.scope.locals : {};

    if (isLocalIdentifier(node, visit.parent)) {
      // if it belongs to a function "someFunc(foo){}"
      const traced = global.identifierReplacement[node.name];

      // traced.replaced is confusing, fails on
      //      import * as hey from "./oi"
      //      hey.something();
      if (traced) {
        if (locals[node.name]) return;
        traced.inUse = true;
        if (traced.first === node.name) {
          return;
        }

        return {
          replaceWith: traced.second
            ? createMemberExpression(traced.first, traced.second)
            : { type: 'Identifier', name: traced.first },
        };
      }
      return;
    }

    return;
  };
}
