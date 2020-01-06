import { ASTNode } from '../interfaces/AST';
import { IFastVisit, IVisit } from './Visitor';

export function astTransformer() {
  let replaces: Array<{ target: IVisit; nodes: Array<ASTNode> }>;
  let insertions: Array<{ target: IVisit; nodes: Array<ASTNode> }>;
  let removes: Array<{ target: IVisit }>;
  let whenFinsihedCallbacks: Array<(node: ASTNode) => void>;
  let prependedToBody: Array<{ target: IVisit; nodes: Array<ASTNode> }>;
  let appendedToBody: Array<{ target: IVisit; nodes: Array<ASTNode> }>;
  let onCompletCallbacks: Array<() => void>;
  const methods = {
    replaceLater: (target: IVisit, nodes: Array<ASTNode>) => {
      if (!replaces) replaces = [];
      replaces.push({ target, nodes });
    },
    removeLater: (target: IVisit) => {
      if (!removes) removes = [];
      removes.push({ target });
    },
    insertAfter: (target: IVisit, nodes: Array<ASTNode>) => {
      if (!insertions) insertions = [];
      insertions.push({ target, nodes });
    },
    onComplete: (cb: () => void) => {
      if (!onCompletCallbacks) onCompletCallbacks = [];
      onCompletCallbacks.push(cb);
    },
    prependToBody: (target: IVisit, nodes: Array<ASTNode>) => {
      if (!prependedToBody) prependedToBody = [];
      prependedToBody.push({ target, nodes });
    },
    appendToBody: (target: IVisit, nodes: Array<ASTNode>) => {
      if (!appendedToBody) appendedToBody = [];
      appendedToBody.push({ target, nodes });
    },

    whenFinished: (fn: (node: ASTNode) => {}) => {
      if (!whenFinsihedCallbacks) whenFinsihedCallbacks = [];
      whenFinsihedCallbacks.push(fn);
    },
    onCompletCallbacks: onCompletCallbacks,
    finalise: (props: IFastVisit) => {
      if (replaces) {
        for (const item of replaces) {
          const visitor = item.target;
          if (visitor.property && visitor.parent) {
            if (visitor.parent[visitor.property] instanceof Array) {
              const index = visitor.parent[visitor.property].indexOf(visitor.node);
              if (index > -1) {
                visitor.parent[visitor.property].splice(index, 1, ...item.nodes);
              }
            } else {
              visitor.parent[visitor.property] = item.nodes[0];
            }
          }
        }
      }

      if (insertions) {
        for (const item of insertions) {
          const visitor = item.target;
          if (visitor.property && visitor.parent) {
            if (visitor.parent[visitor.property] instanceof Array) {
              const index = visitor.parent[visitor.property].indexOf(visitor.node);
              //console.log('>>>', JSON.stringify(item.nodes[0], null, 2));
              if (index > -1) {
                visitor.parent[visitor.property].splice(index + 1, 0, ...item.nodes);
              }
            } else {
              visitor.parent[visitor.property] = item.nodes[0];
            }
          }
        }
      }

      if (removes) {
        for (const item of removes) {
          const visitor = item.target;
          if (visitor.property && visitor.parent) {
            if (visitor.parent[visitor.property] instanceof Array) {
              const index = visitor.parent[visitor.property].indexOf(visitor.node);
              if (index > -1) {
                visitor.parent[visitor.property].splice(index, 1);
              }
            }
          }
        }
      }

      if (whenFinsihedCallbacks) {
        for (const cb of whenFinsihedCallbacks) {
          cb(props.ast);
        }
      }

      if (prependedToBody) {
        let index = 0;
        while (index < prependedToBody.length) {
          (props.ast.body as Array<ASTNode>).splice(index, 0, ...prependedToBody[index].nodes);
          index++;
        }
      }

      if (appendedToBody) {
        for (const item of appendedToBody) {
          for (const c of item.nodes) {
            (props.ast.body as Array<ASTNode>).push(c);
          }
        }
      }
    },
  };

  return methods;
}
