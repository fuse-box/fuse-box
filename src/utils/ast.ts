export function nodeIsString(node) {
  return node.type === 'Literal' || node.type === 'StringLiteral';
}

interface IVisitProps {
  context?: IASTContext;
  idx?: number;
  parent?: any;
  prop?: string;
}
interface IASTContext {
  exports?: Array<string>;
  locals?: Array<string>;
}
interface IASTWalkProps {
  withScope?: boolean;
  visit?: (node: any, props: IVisitProps, context?: IASTContext) => void;
}
export function fastWalk(ast: any, walker: IASTWalkProps) {
  function visit(node, props: IVisitProps, context) {
    if (walker.withScope) {
      if (node.context) {
        context = node.context;
      }

      if (node.type === 'VariableDeclaration') {
        if (node.declarations) {
          for (const decl of node.declarations) {
            if (decl.type === 'VariableDeclarator' && decl.id && decl.id.type === 'Identifier') {
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

      if (node.type === 'ExpressionStatement') {
        if (node.expression && node.expression.arguments) {
          node.expression.arguments.context = context;
        }
      }

      if (
        node.type === 'FunctionDeclaration' ||
        node.type === 'FunctionExpression' ||
        node.type === 'ArrowFunctionExpression'
      ) {
        if (node.id && node.id.type === 'Identifier') {
          // handles the following case:
          /*
            function o() {}
            console.log(o)
          */
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
            if (item.type === 'Identifier') {
              let body = node.body;
              if (body.context === undefined) {
                // create context
                body.context = {
                  exports: context && context.exports ? context.exports.concat([]) : [],
                  // here we need to make a copy of the locals
                  locals: context ? context.locals.concat([]) : [],
                };
              }
              body.context.locals.push(item.name);
            }
          }
        }
      }
    }

    walker.visit(node, props, context);
    for (const prop in node) {
      if (prop[0] === '$') {
        continue;
      }
      const child = node[prop];
      if (child instanceof Array) {
        for (let i = 0; i < child.length; i++) {
          if (child && child[i] && child[i].type) {
            visit(child[i], { idx: i, parent: node, prop }, context);
          }
        }
      } else {
        if (child && child.type) visit(child, { parent: node, prop }, context);
      }
    }
  }

  visit(ast, {}, undefined);
}
