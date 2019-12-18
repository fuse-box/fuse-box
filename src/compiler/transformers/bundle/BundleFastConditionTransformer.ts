import { ASTNode } from '../../interfaces/AST';
import { computeBoolean } from '../../static_compute/computeBoolean';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { ITransformer } from '../../interfaces/ITransformer';

export interface IBundleFastConditionTransformer {
  env: { [key: string]: any };
  isServer?: boolean;
  isBrowser?: boolean;
}

export function BundleFastConditionUnwrapper(): ITransformer {
  return {
    commonVisitors: props => {
      const env = props.ctx.config.env;
      const isBrowser = props.ctx.config.target === 'browser';
      const isServer = props.ctx.config.target === 'server';

      return {
        onEachNode: (visit: IVisit): IVisitorMod => {
          const { node } = visit;
          if (node.type === 'IfStatement') {
            let operator = node.test.operator;
            let rightValue;
            let target: ASTNode;
            if (node.test) {
              if (node.test.type === 'MemberExpression') {
                target = node.test;
              }
              const left = node.test.left;
              const right = node.test.right;
              if (right && right.type === 'Literal') {
                rightValue = right.value;
              }
              if (left) {
                if (left.type == 'MemberExpression') target = left;
              }
            }
            let replacement: ASTNode;
            let result: boolean;

            let shouldTranspile = false;

            if (target) {
              // process.env.*
              if (
                target.object.type === 'MemberExpression' &&
                target.object.object.name === 'process' &&
                target.object.property.name === 'env'
              ) {
                if (rightValue && operator) {
                  shouldTranspile = true;
                  result = computeBoolean(env[target.property.name], operator, rightValue);
                  if (result) replacement = node.consequent;
                  else replacement = node.alternate;
                }
              }
              if (target.object.name === 'FuseBox') {
                if (target.property.name === 'isBrowser') {
                  shouldTranspile = true;
                  if (isBrowser) replacement = node.consequent;
                  else replacement = node.alternate;
                }

                if (target.property.name === 'isServer') {
                  shouldTranspile = true;
                  if (isServer) replacement = node.consequent;
                  else replacement = node.alternate;
                }
              }
            }

            if (shouldTranspile) {
              if (replacement) {
                if (replacement.body) return { replaceWith: replacement.body };
                else if (replacement.type === 'ExpressionStatement') return { replaceWith: replacement };
              } else {
                return { removeNode: true };
              }
            }
          }
          return;
        },
      };
    },
  };
}
