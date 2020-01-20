import { ASTNode, ASTType } from '../interfaces/AST';

export enum expressionValueTypes {
  SINGLE_ASTERISK,
  DOUBLE_ASTERISK,
}

/**
 * get the source of an dynamic import
 * @param node
 */
export function getDynamicImport(node: ASTNode): { error?: string; source?: string } {
  // meriyah case
  if (node.type === ASTType.ImportExpression) {
    if (node.source) {
      return { source: node.source.value };
    }
    return { error: 'At this moment computed statements are not supported' };
  }
  // eslint parser case
  if (node.type === ASTType.CallExpression) {
    if (node.callee && node.callee.type === 'Import') {
      if (node.arguments.length === 1 && !!node.arguments[0].value) {
        return { source: node.arguments[0].value };
      }
      return { error: 'At this moment computed statements are not supported' };
    }
  }
}

export interface IComputedStatementPaths {
  error?: string;
  paths?: Array<string>;
}

/**
 * Helper function to return the correct element to add to the path
 * @param expression
 * @param last
 */
function getExpressionValue(expression: ASTNode, last: boolean = false): string {
  const asterisk = last ? expressionValueTypes.SINGLE_ASTERISK : expressionValueTypes.DOUBLE_ASTERISK;
  return expression.type === 'Literal' ? expression.value : asterisk;
}

function isSupportedNodeType(type: string): boolean {
  return type === ASTType.Identifier || type === ASTType.Literal;
}

/**
 * Put in an expression and get the parsed paths
 * or an error in return
 * @param expression
 * @param strict
 * @param last
 */
function getPathFromExpression(
  expression: ASTNode,
  strict: boolean = false,
  last: boolean = true,
): IComputedStatementPaths {
  let paths: Array<string> = [];
  let errored: boolean = false;

  // if we have a nested BinaryExpression we got to traverse through it
  while (expression.left.left && !errored) {
    if (!isSupportedNodeType(expression.right.type)) {
      errored = true;
    }

    // the first hit will be the last element
    paths.unshift(getExpressionValue(expression.right, last));
    last = false;
    expression = expression.left;
  }

  // we errored or last expressions are unsupported
  if (errored || !isSupportedNodeType(expression.left.type) || !isSupportedNodeType(expression.right.type)) {
    return { error: `Unsupported type provided to computed statement import` };
  }

  // if we have strict enabled, the first element needs to be a string!
  if (strict && expression.left.type !== ASTType.Literal) {
    return { error: `You're computed import needs to start with a string! i.e. './'` };
  }

  // if we didn't resolve the last element already, it means this is the last element
  paths.unshift(getExpressionValue(expression.left), getExpressionValue(expression.right, last));
  return { paths };
}

/**
 * Function that returns a valid paths object or error
 * @param template
 */
function getPathFromTemplate(template: ASTNode): IComputedStatementPaths {
  const { expressions, quasis } = template;
  const quasisLength: number = quasis.length;
  let paths: Array<string> = [];
  let i: number = 0;
  let error: string;
  let errored: boolean = false;
  /**
   * we loop over the quasis of the template string
   * and each item is a TemplateElement followed by
   * 1. BinaryExpression
   * 2. All the others (Identifier mostly)
   */
  while (i < quasisLength && !errored) {
    let skipExpression: boolean = false;
    if (quasis[i].value.cooked) {
      // add the string to the stack
      paths.push(quasis[i].value.cooked);
    } else {
      // we skip the following expression if we didn't had an value
      skipExpression = true;
    }
    // if we aren't at the end, tail is false, so we resolve the
    // expression that's followed by this TemplateElement
    if (!quasis[i].tail && expressions.length > 0) {
      const expression = expressions.shift();

      // if we don't skip, we got to resolve the expression correctly
      if (!skipExpression) {
        // we need to figure out of this expression is the last element
        // so no TemplateElements should follow
        let last: boolean = true;
        for (let offset = 1; offset < quasisLength - i; offset++) {
          if (quasis[i + offset] && quasis[i + offset].value.cooked) {
            last = false;
            break;
          }
        }
        if (expression.type === ASTType.BinaryExpression) {
          const result = getPathFromExpression(expression, false, last);
          if (result.error) {
            error = result.error;
            errored = true;
          }
          paths = paths.concat(result.paths);
        } else if (isSupportedNodeType(expression.type)) {
          paths.push(getExpressionValue(expression, last));
        } else {
          error = `Unsupported type provided to computed statement import`;
        }
      }
    }
    i++;
  }
  return { error, paths };
}

/**
 * This function tries to generate a glob pattern based on the input
 * Valid inputs are a BinaryExpression or TemplateLiteral
 *
 * import('./atoms/' + b);
 * import('./atoms/' + b + '/' + c);
 * import(`./atoms/${a}`);
 *
 * @param node
 */
export function computedStatementToPath(node: ASTNode): IComputedStatementPaths {
  if (node.type === ASTType.BinaryExpression) {
    return getPathFromExpression(node, true);
  } else if (node.type === ASTType.TemplateLiteral) {
    return getPathFromTemplate(node);
  }
  return { error: `Unsupported root node provided` };
}
