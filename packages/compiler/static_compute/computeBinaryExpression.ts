import { ASTNode } from '../interfaces/AST';

type ComputedIdentfiers = { [key: string]: any };

function calcExpression(left, operator, right) {
  let result;
  switch (operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return left / right;
    case '%':
      return left % right;
    case '>>':
      return left >> right;
    case '>>>':
      return left >>> right;
    case '<<':
      return left << right;
    case '|':
      return left | right;
    case '&':
      return left & right;
    case '^':
      return left ^ right;
    case '**':
      let i = right;
      while (--i) {
        result = result || left;
        result = result * left;
      }
      break;
    default:
  }
  return result;
}

function getValue(node: ASTNode, ce?: ComputedIdentfiers) {
  if (node.value) return node.value;
  switch (node.type) {
    case 'BinaryExpression':
      return computeNode(node, ce);
    case 'Identifier':
      if (ce && ce[node.name] !== undefined) {
        return ce[node.name];
      }
      return NaN;
    case 'CallExpression':
      if (node.callee && node.callee.type === 'MemberExpression' && node.callee.object.name === 'Math') {
        if (Math[node.callee.property.name] && node.arguments.length) {
          const results = [];
          for (const a of node.arguments) results.push(getValue(a));
          return Math[node.callee.property.name](...results);
        }
      }
    default:
      return NaN;
  }
}

function computeNode(node: ASTNode, ce?: ComputedIdentfiers) {
  const left = getValue(node.left, ce);
  if (left === NaN) return;
  const right = getValue(node.right, ce);
  if (right === NaN) return;
  return calcExpression(left, node.operator, right);
}

export function computeBinaryExpression(node: ASTNode, ce?: ComputedIdentfiers) {
  return computeNode(node, ce);
}
