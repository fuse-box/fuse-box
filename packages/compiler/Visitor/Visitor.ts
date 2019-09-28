import { ASTNode } from '../interfaces/AST';
import { astTransformer } from './astTransformer';
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
  globalContext?: any;
  parent?: ASTNode;
  property?: string;
  id?: number;
  scope?: IASTScope;
}

export interface IVisitorMod {
  context?: any;
  replaceWith?: ASTNode | Array<ASTNode>;
  scopeMeta?: { [key: string]: any };
  insertAfterThisNode?: ASTNode | Array<ASTNode>;
  ignoreChildren?: boolean;
  whenFinished?: (ast: ASTNode) => void;
  removeNode?: boolean;
}

export interface IFastVisit {
  ast: ASTNode;
  onNamespace?: (node: ASTNode) => ASTNode;
  firstLevel?: boolean;
  fn: (visit: IVisit) => IVisitorMod;
  globalContext?: any;
}

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
    if (response.removeNode) {
      t.removeLater(visit);
      return;
    } else if (response.replaceWith) {
      let replacedNodes = [].concat(response.replaceWith);
      t.replaceLater(visit, replacedNodes);
      // we need walk through them right after replacing and ignore the old nodes
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

  for (const property in node) {
    if (property[0] === '$') {
      continue;
    }

    const child = node[property];
    if (child instanceof Array) {
      for (let i = 0; i < child.length; i++) {
        if (child && child[i] && child[i].type) {
          _visit(t, globalContext, fn, child[i], { parent: node, property, id: i }, visit.scope);
        }
      }
    } else {
      if (child && child.type) _visit(t, globalContext, fn, child, { parent: node, property }, visit.scope);
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
