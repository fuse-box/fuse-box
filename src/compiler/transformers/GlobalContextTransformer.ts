import { IVisit } from '../Visitor/Visitor';
import { createMemberExpression } from '../Visitor/helpers';
import { isLocalDefined } from '../helpers/astHelpers';
import { ASTNode } from '../interfaces/AST';
import { ITransformer } from '../interfaces/ITransformer';
import { GlobalContext } from '../program/GlobalContext';

export function ContextTransformer(visit: IVisit) {
  const node = visit.node;
  const globalContext = visit.globalContext as GlobalContext;

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
    const traced = globalContext.identifierReplacement[nodeName];

    if (globalContext.refInterceptors.has(nodeName)) {
      const response = globalContext.refInterceptors.get(nodeName)(shorthand || node, visit);
      if (response) return response;
    }

    // traced.replaced is confusing, fails on
    //      import * as hey from "./oi"
    //      hey.something();
    if (traced && traced.first) {
      if (isLocalDefined(nodeName, visit.scope)) {
        return;
      }

      traced.inUse = true;
      if (traced.first === nodeName) {
        return;
      }
      // even if we found the variable it might be defined as a hoisted variable down the scope

      const statement: ASTNode = traced.second
        ? createMemberExpression(traced.first, traced.second)
        : { name: traced.first, type: 'Identifier' };
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
}

export function GlobalContextTransformer(): ITransformer {
  return {
    commonVisitors: props => ({
      onEachNode: ContextTransformer,
    }),
  };
}
