import { nodeIsString } from '../utils/ast';
import { IWebWorkerType } from '../analysis/fastAnalysis';

export function getVariableDeclarations(node) {
  if (node.declaration && node.declaration.type === 'VariableDeclaration') {
    if (node.declaration.declarations) {
      return node.declaration.declarations;
    }
  }
}

export function getSpecifiers(node) {
  if (node.declaration && node.declaration.type === 'VariableDeclaration') {
    if (node.declaration.declarations) {
      return node.declaration.declarations;
    }
  }
}

export function isExportDefaultDeclaration(node) {
  return node.type === 'ExportDefaultDeclaration';
}

export function isExportNamedDeclaration(node) {
  return node.type === 'ExportNamedDeclaration';
}

export function isFunctionDeclaration(node) {
  return node.type === 'FunctionDeclaration';
}
export function isClassDeclaration(node) {
  return node.type === 'ClassDeclaration';
}

export function isWorkerStatement(node): { value: string; type: IWebWorkerType } {
  if (node.type === 'NewExpression' && node.callee) {
    if (node.callee.type === 'Identifier' && (node.callee.name === 'Worker' || node.callee.name === 'SharedWorker')) {
      if (node.arguments && node.arguments.length === 1) {
        if (node.arguments[0].type === 'Literal') {
          return { value: node.arguments[0].value, type: node.callee.name };
        }
      }
    }
  }
}
export function isRequireStatement(node, parent) {
  if (node.type === 'CallExpression' && node.callee) {
    if (node.callee.type === 'Identifier' && node.callee.name === 'require') {
      let arg1 = node.arguments[0];
      if (node.arguments.length === 1 && nodeIsString(arg1)) {
        return arg1.value;
      }
    }
  }
}

export function isShortHandIdentifier(node, parent) {
  if (node.type === 'Property' && node.shorthand === true) {
    if (node.value && node.value.type === 'Identifier') {
      return { node: node.value, parent: node };
    }
  }
}

export function isLocalIdentifier(node, parent) {
  if (node.type === 'Identifier' && parent) {
    return (
      (parent.computed === true || (parent.property !== node && !parent.computed)) &&
      parent.key !== node &&
      parent.type !== 'FunctionDeclaration' &&
      parent.type !== 'FunctionExpression' &&
      parent.type !== 'ArrowFunctionExpression'
    );
  }
}

export function createTracedExpression(local: string, property) {
  return {
    type: 'MemberExpression',
    object: {
      type: 'Identifier',
      name: local,
    },
    computed: false,
    property: property,
  };
}
export function createRequireStatement(local: string, source: string) {
  const reqStatement = {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: 'require',
    },
    arguments: [
      {
        type: 'Literal',

        value: source,
      },
    ],
  };
  if (!local) {
    return {
      type: 'ExpressionStatement',
      expression: reqStatement,
    };
  }
  return {
    type: 'VariableDeclaration',

    declarations: [
      {
        type: 'VariableDeclarator',

        id: {
          type: 'Identifier',
          start: 7,
          end: 8,
          name: local,
        },
        init: reqStatement,
      },
    ],
    kind: 'const',
  };
}

export function createLocalVariable(name: string, property) {
  return {
    type: 'VariableDeclaration',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: name,
        },
        init: property,
      },
    ],
    kind: 'const',
  };
}

export function createMemberExpression(obj: string, target: string) {
  return {
    type: 'MemberExpression',
    object: {
      type: 'Identifier',
      name: obj,
    },
    property: {
      type: 'Identifier',
      name: target,
    },
    computed: false,
  };
}
export function createExportsExpression(name: string) {
  return {
    type: 'MemberExpression',
    object: {
      type: 'Identifier',
      name: 'exports',
    },
    computed: false,
    property: {
      type: 'Identifier',
      name: name,
    },
  };
}
export function createModuleExports(exportsVariableName, property) {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'exports',
        },
        computed: false,
        property: {
          type: 'Identifier',
          name: exportsVariableName,
        },
      },
      right: property,
    },
  };
}

export function createModuleExportsAssign(fromSource: string) {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'Object',
        },
        computed: false,
        property: {
          type: 'Identifier',
          name: 'assign',
        },
      },
      arguments: [
        {
          type: 'Identifier',
          name: 'exports',
        },
        {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'require',
          },
          arguments: [
            {
              type: 'Literal',
              value: fromSource,
            },
          ],
        },
      ],
    },
  };
}
