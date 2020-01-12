import { ASTNode } from '../interfaces/AST';
import { ITransformer } from '../interfaces/ITransformer';
import { GlobalContext } from '../program/GlobalContext';
import { createMemberExpression } from '../Visitor/helpers';

export function GlobalContextTransformer(): ITransformer {
  return {
    commonVisitors: props => ({
      onEachNode: visit => {
        const node = visit.node;
        const global = visit.globalContext as GlobalContext;
        const locals = visit.scope && visit.scope.locals ? visit.scope.locals : {};
        if (node.type === 'ObjectPattern') {
          for (const item of node.properties) {
            item.$assign_pattern = true;
          }
        }
        let shorthand;
        if (node.type === 'Property' && node.shorthand === true) {
          if (node.value && node.value.type === 'Identifier') {
            shorthand = node.value;
          }
        }
        if (visit.isLocalIdentifier || (shorthand && !node.$assign_pattern)) {
          let nodeName;
          if (shorthand) nodeName = shorthand.name;
          else nodeName = node.name;

          // if it belongs to a function "someFunc(foo){}"
          const traced = global.identifierReplacement[nodeName];
          // traced.replaced is confusing, fails on
          //      import * as hey from "./oi"
          //      hey.something();
          if (traced && traced.first) {
            if (locals[nodeName] === 1) {
              return;
            }

            traced.inUse = true;
            if (traced.first === nodeName) {
              return;
            }
            // even if we found the variable it might be defined as a hoisted variable down the scope

            const statement: ASTNode = traced.second
              ? createMemberExpression(traced.first, traced.second)
              : { type: 'Identifier', name: traced.first };
            if (shorthand) {
              if (node.shorthand) node.shorthand = false;
              node.value = statement;
              return { replaceWith: node };
            }
            if (statement.object) {
              statement.object.loc = node.loc;
            }
            return { replaceWith: statement };
          }
          return;
        }
        return;
      },
    }),
  };
}
