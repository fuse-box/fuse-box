import { ASTNode } from '../../interfaces/AST';
import { computeBoolean } from '../../static_compute/computeBoolean';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';

export interface IBundleFastConditionTransformer {
  env: { [key: string]: any };
  isServer?: boolean;
  isBrowser?: boolean;
}
export function BundleFastConditionUnwrapper(options: IBundleFastConditionTransformer) {
  return (visit: IVisit): IVisitorMod => {
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

      if (target) {
        // process.env.*
        if (
          target.object.type === 'MemberExpression' &&
          target.object.object.name === 'process' &&
          target.object.property.name === 'env'
        ) {
          if (rightValue && operator) {
            result = computeBoolean(options.env[target.property.name], operator, rightValue);
            if (result) replacement = node.consequent;
            else replacement = node.alternate;
          }
        }
        if (target.object.name === 'FuseBox') {
          if (target.property.name === 'isBrowser') {
            if (options.isBrowser) replacement = node.consequent;
            else replacement = node.alternate;
          }

          if (target.property.name === 'isServer') {
            if (options.isServer) replacement = node.consequent;
            else replacement = node.alternate;
          }
        }
      }

      if (replacement) {
        if (replacement.body) return { replaceWith: replacement.body };
        else if (replacement.type === 'ExpressionStatement') return { replaceWith: replacement };
      } else {
        return { removeNode: true };
      }
    }
    return;
  };
}
