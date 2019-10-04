import { ASTNode } from '../interfaces/AST';
import { astTransformer } from './astTransformer';
import { isLocalIdentifier } from './helpers';
import { scopeTracker } from './scopeTracker';

export interface IVisitProps {
  parent?: any;
  prop?: string;
  id?: number;
  context?: IASTScope;
}
export interface IASTScope {
  context?: any;
  locals?: { [key: string]: any };
  meta?: { [key: string]: any };
  namespace?: string;
}

export interface IVisit {
  node: ASTNode;
  isLocalIdentifier?: boolean;
  globalContext?: any;
  parent?: ASTNode;
  property?: string;
  id?: number;
  scope?: IASTScope;
}

export interface IVisitorMod {
  context?: any;
  replaceWith?: ASTNode | Array<ASTNode>;
  avoidReVisit?: boolean;
  scopeMeta?: { [key: string]: any };
  insertAfterThisNode?: ASTNode | Array<ASTNode>;
  prependToBody?: Array<ASTNode>;
  onComplete?: () => void;
  ignoreChildren?: boolean;
  removeNode?: boolean;
}

export interface IFastVisit {
  ast: ASTNode;
  onNamespace?: (node: ASTNode) => ASTNode;
  firstLevel?: boolean;
  fn: (visit: IVisit) => IVisitorMod;
  globalContext?: any;
}

const IRNOGED_TYPES = {
  typeAnnotation: 1,
  typeParameters: 1,
  returnType: 1,
  implements: 1,
  decorators: 1,
  superTypeParameters: 1,
};
function _visit(
  t,
  globalContext,
  fn: (visit: IVisit) => IVisitorMod | void,
  node: ASTNode,
  props: { parent?; property?; id?: number },
  scope: IASTScope,
) {
  const visit = {
    scope,
    globalContext,
    node,
    parent: props.parent,
    property: props.property,
    id: props.id,
    isLocalIdentifier: isLocalIdentifier(node, props.parent),
  };

  scopeTracker(visit);

  const response = fn(visit);
  if (response) {
    if (response.scopeMeta) {
      if (!visit.scope) {
        visit.scope = { meta: {} };
        visit.node.scope = visit.scope;
      } else {
        if (!visit.scope.meta) visit.scope.meta = {};
        visit.node.scope = visit.scope;
      }

      for (const key in response.scopeMeta) {
        visit.node.scope.meta[key] = response.scopeMeta[key];
      }
    }
    if (response.onComplete) {
      globalContext.completeCallbacks.push(response.onComplete);
    }
    if (response.prependToBody) {
      t.prependToBody(visit, response.prependToBody);
    }
    if (response.removeNode) {
      t.removeLater(visit);
      return;
    } else if (response.replaceWith) {
      let replacedNodes = [].concat(response.replaceWith);
      t.replaceLater(visit, replacedNodes);
      // we need walk through them right after replacing and ignore the old nodes
      if (response.avoidReVisit || response.ignoreChildren) return;
      for (const n of replacedNodes) {
        _visit(t, globalContext, fn, n, { parent: props.parent, property: props.property }, visit.scope);
      }
      return;
    } else if (response.insertAfterThisNode) {
      let insertNodes = [].concat(response.insertAfterThisNode);
      t.insertAfter(visit, insertNodes);
      return;
    } else if (response.ignoreChildren) {
      return;
    }
  }
  //node.$parent = props.parent;
  for (const property in node) {
    if (property[0] === '$') {
      continue;
    }
    const child = node[property];
    if (child instanceof Array) {
      let i = 0;
      while (i < child.length) {
        const item = child[i];
        if (item && item.type && !IRNOGED_TYPES[item.type]) {
          _visit(t, globalContext, fn, item, { parent: node, property, id: i }, visit.scope);
        }
        i++;
      }
    } else {
      if (child && child.type && !IRNOGED_TYPES[child.type])
        _visit(t, globalContext, fn, child, { parent: node, property }, visit.scope);
    }
  }
}

export function TopLevelVisit(props: IFastVisit) {
  const transformer = astTransformer();

  if (props.ast.body instanceof Array) {
    let id = 0;
    while (id < props.ast.body.length) {
      const item = props.ast.body[id];
      const visit: IVisit = {
        globalContext: props.globalContext,
        node: item,
        parent: props.ast,
        property: 'body',
        id: id,
      };

      if (item.type === 'ModuleDeclaration') {
        if (props.onNamespace) props.onNamespace(item);
      }
      const response = props.fn(visit);
      if (response) {
        if (response.onComplete) {
          props.globalContext.completeCallbacks.push(response.onComplete);
        }
        if (response.removeNode) {
          transformer.removeLater(visit);
        } else if (response.replaceWith) {
          let replacedNodes = [].concat(response.replaceWith);
          transformer.replaceLater(visit, replacedNodes);
        } else if (response.insertAfterThisNode) {
          let insertNodes = [].concat(response.insertAfterThisNode);
          transformer.insertAfter(visit, insertNodes);
        }
      }

      id++;
    }
    transformer.finalise(props);
  }
}

export function FastVisit(props: IFastVisit): ASTNode {
  const transformer = astTransformer();

  //console.log(JSON.stringify(props.ast, null, 2));
  _visit(transformer, props.globalContext, props.fn, props.ast, {}, undefined);
  transformer.finalise(props);

  return props.ast;
}
