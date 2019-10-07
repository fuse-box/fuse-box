export function computeBoolean(left: string, operator: string, right: string) {
  switch (operator) {
    case '!=':
      return left != right;
    case '!==':
      return left !== right;
    case '===':
      return left === right;
    case '==':
      return left === right;
    case '>':
      return left > right;
    case '>=':
      return left >= right;
    case '<':
      return left < right;
    case '<=':
      return left <= right;
  }
}
