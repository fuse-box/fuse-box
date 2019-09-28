import { NodeContext } from "./NodeContext";

export interface IVisitProps {
  parent?: any;
  prop?: string;
  idx?: number;
  context?: IASTContext;
}
export interface IASTContext {
  nodeContext?: NodeContext;
  locals?: Array<string>;
  exports?: Array<string>;
}

export interface IASTVisitor {
  node: any;
  props: IVisitProps;
  context?: IASTContext;
}
interface IASTWalkProps {
  withScope?: boolean;
  visit?: (props: IASTVisitor) => any;
}
export function fastWalk(ast: any, walker: IASTWalkProps) {
  function visit(node, props: IVisitProps, context) {
    if (walker.withScope) {
      if (node.context) {
        context = node.context;
        if (!node.context.locals) node.context.locals = [];
      }

      if (node.type === "VariableDeclaration") {
        if (node.declarations) {
          for (const decl of node.declarations) {
            if (
              decl.type === "VariableDeclarator" &&
              decl.id &&
              decl.id.type === "Identifier"
            ) {
              if (context === undefined) context = { locals: [] };
              context.locals.push(decl.id.name);
              // we need to check for the next item on the list (if we are in an array)
              if (props.idx && props.prop) {
                if (props.parent[props.prop][props.idx + 1]) {
                  props.parent[props.prop][props.idx + 1].context = context;
                }
              }
            }
          }
        }
      }

      if (node.type === "ExpressionStatement") {
        if (node.expression && node.expression.arguments) {
          node.expression.arguments.context = context;
        }
      }

      if (
        node.type === "FunctionDeclaration" ||
        node.type === "FunctionExpression"
      ) {
        if (node.id && node.id.type === "Identifier") {
          if (context === undefined) context = { locals: [] };
          context.locals.push(node.id.name);
          if (props.idx && props.prop) {
            if (props.parent[props.prop][props.idx + 1]) {
              props.parent[props.prop][props.idx + 1].context = context;
            }
          }
        }
        if (node.params) {
          for (const item of node.params) {
            if (item.type === "Identifier") {
              if (node.body.context === undefined) {
                // create context
                node.body.context = {
                  exports:
                    context && context.exports
                      ? context.exports.concat([])
                      : [],
                  // here we need to make a copy of the locals
                  locals: context ? context.locals.concat([]) : []
                };
              }
              node.body.context.locals.push(item.name);
            }
          }
        }
      }
    }

    const newNode = walker.visit({ node, props, context });
    if (newNode) {
      if (props.prop && props.parent) {
        if (props.idx) {
          props.parent[props.prop][props.idx] = newNode;
        } else {
          props.parent[props.prop] = newNode;
        }
      }
      node = newNode;
    }
    for (const prop in node) {
      if (prop[0] === "$") {
        continue;
      }
      const child = node[prop];
      if (child instanceof Array) {
        for (let i = 0; i < child.length; i++) {
          if (child && child[i] && child[i].type) {
            visit(child[i], { parent: node, prop, idx: i }, context);
          }
        }
      } else {
        if (child && child.type) visit(child, { parent: node, prop }, context);
      }
    }
  }

  visit(ast, {}, undefined);
}

export interface IVisit {
  node: any;
  parent?: any;
  prop?: string;
  idx?: number;
  context?: IASTContext;
}
export function FastVisit(ast, fn: (visit: IVisit) => void) {
  function _visit(
    node,
    props: { parent?; propName?; id? },
    context: IASTContext
  ) {}

  _visit(ast, {}, undefined);
}
