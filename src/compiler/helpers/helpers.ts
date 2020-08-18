import { ASTNode, ASTType } from '../interfaces/AST';

const _isLocalIdentifierRulesExceptionNodes = {
  ArrayPattern: 1,
  ClassDeclaration: 1,
  FunctionDeclaration: 1,
  FunctionExpression: 1,
  ImportDeclaration: 1,
  //ArrowFunctionExpression: 1,
  ImportDefaultSpecifier: 1,
  ImportNamespaceSpecifier: 1,
  ImportSpecifier: 1,
  RestElement: 1,

  [ASTType.CatchClause]: 1,
  [ASTType.ImportEqualsDeclaration]: 1,
  [ASTType.QualifiedName]: 1,
  [ASTType.TypeReference]: 1,
  //  [ASTType.VariableDeclarator]: 1,
};
export function isLocalIdentifier(node: ASTNode, parent: ASTNode, propertyName: string) {
  if (propertyName === 'params') return;
  if (node.type === 'Identifier') {
    if (propertyName === 'superClass') return true;

    if (parent && parent.type === ASTType.AssignmentPattern && parent.left === node) {
      return;
    }
    if (_isLocalIdentifierRulesExceptionNodes[parent.type] || parent.$assign_pattern) return;
    if (parent) {
      if (parent.computed) return true;
      return parent.property !== node && !parent.computed && parent.key !== node;
    }
  }
}

export function isValidMethodDefinition(node: ASTNode) {
  return node.type === 'MethodDefinition' && node.value.type === 'FunctionExpression' && node.value.body;
}

export function isDefinedLocally(node: ASTNode): Array<{ init: boolean; name: string }> {
  // if (node.id && node.id.name) {
  //   return [node.id.name];
  // }
  if (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') {
    if (node.id) return [{ init: true, name: node.id.name }];
  }
  if (node.$assign_pattern && node.value && node.value.type === ASTType.Identifier) {
    return [{ init: true, name: node.value.name }];
  }
  if (node.type === 'VariableDeclaration') {
    const defined = [];
    if (node.declarations) {
      for (const decl of node.declarations) {
        if (decl.type === 'VariableDeclarator' && decl.id) {
          if (decl.id.type === 'Identifier') {
            defined.push({ init: !!decl.init, name: decl.id.name });
          } else if (decl.id.type === ASTType.ObjectPattern) {
          }
        }
      }
      return defined;
    }
  }
}

export function createMemberExpression(obj: string, target: string): ASTNode {
  return {
    computed: false,
    object: {
      name: obj,
      type: 'Identifier',
    },
    property: {
      name: target,
      type: 'Identifier',
    },
    type: 'MemberExpression',
  };
}

export function createExpressionStatement(left: ASTNode, right: ASTNode): ASTNode {
  return {
    expression: {
      left: left,
      operator: '=',
      right: right,
      type: 'AssignmentExpression',
    },
    type: 'ExpressionStatement',
  };
}
export function defineVariable(name: string, right: ASTNode): ASTNode {
  return {
    declarations: [
      {
        id: {
          name: name,
          type: 'Identifier',
        },
        init: right,
        type: 'VariableDeclarator',
      },
    ],
    kind: 'var',
    type: 'VariableDeclaration',
  };
}

export function createVariableDeclaration(name: string, node: ASTNode): ASTNode {
  return {
    declarations: [
      {
        id: {
          name: name,
          type: 'Identifier',
        },
        init: node,
        type: 'VariableDeclarator',
      },
    ],
    kind: 'let',
    type: 'VariableDeclaration',
  };
}

export function createLiteral(value): ASTNode {
  return { type: 'Literal', value };
}
export function createExports(props: {
  exportsKey: string;
  exportsVariableName: string;
  property: ASTNode;
  useModule?: boolean;
}): ASTNode {
  let obj: ASTNode = {
    name: props.exportsKey,
    type: 'Identifier',
  };
  if (props.useModule && props.exportsKey === 'exports') {
    obj = {
      computed: false,
      object: {
        name: 'module',
        optional: false,
        type: 'Identifier',
      },
      property: {
        name: 'exports',
        type: 'Identifier',
      },
      type: 'MemberExpression',
    };
  }
  return {
    expression: {
      left: {
        computed: false,
        object: obj,
        property: {
          name: props.exportsVariableName,
          type: 'Identifier',
        },
        type: 'MemberExpression',
      },
      operator: '=',
      right: props.property,
      type: 'AssignmentExpression',
    },
    type: 'ExpressionStatement',
  };
}

export function createRequireStatement(source: string, local?: string): { reqStatement: ASTNode; statement: ASTNode } {
  const reqStatement: ASTNode = {
    arguments: [
      {
        type: 'Literal',
        value: source,
      },
    ],
    callee: {
      name: 'require',
      type: 'Identifier',
    },
    type: 'CallExpression',
  };
  if (!local) {
    return {
      reqStatement,
      statement: {
        expression: reqStatement,
        type: 'ExpressionStatement',
      },
    };
  }
  return {
    reqStatement,
    statement: {
      type: 'VariableDeclaration',

      declarations: [
        {
          type: 'VariableDeclarator',

          id: {
            name: local,
            type: 'Identifier',
          },
          init: reqStatement,
        },
      ],
      kind: 'var',
    },
  };
}

function findObject(node: ASTNode, accessList: Array<string>) {
  if (!node.object) {
    return;
  }
  if (!node.object.name) {
    accessList.unshift(node.property.name);
    return findObject(node.object, accessList);
  }
  accessList.unshift(node.property.name);
  return node.object;
}

const _CallExpression = {
  CallExpression: 1,
  NewExpression: 1,
};

export const ES_MODULE_EXPRESSION: ASTNode = {
  expression: {
    left: {
      computed: false,
      object: {
        name: 'exports',
        type: 'Identifier',
      },
      property: {
        name: '__esModule',
        type: 'Identifier',
      },
      type: 'MemberExpression',
    },
    operator: '=',
    right: {
      type: 'Literal',
      value: true,
    },
    type: 'AssignmentExpression',
  },
  type: 'ExpressionStatement',
};
export function createEsModuleDefaultInterop(props: {
  helperObjectName: string;
  helperObjectProperty: string;
  targetIdentifierName: string;
  variableName: string;
}): ASTNode {
  return {
    declarations: [
      {
        id: {
          name: props.variableName,
          type: 'Identifier',
        },
        init: {
          arguments: [
            {
              name: props.targetIdentifierName,
              type: 'Identifier',
            },
          ],
          callee: {
            computed: false,
            object: {
              name: props.helperObjectName,
              type: 'Identifier',
            },
            property: {
              name: props.helperObjectProperty,
              type: 'Identifier',
            },
            type: 'MemberExpression',
          },
          type: 'CallExpression',
        },
        type: 'VariableDeclarator',
      },
    ],
    kind: 'var',
    type: 'VariableDeclaration',
  };
}

export function createRequireCallExpression(elements: Array<ASTNode>): ASTNode {
  return {
    arguments: elements,
    callee: {
      name: 'require',
      type: 'Identifier',
    },
    type: 'CallExpression',
  };
}
export function createASTFromObject(obj: { [key: string]: any }): ASTNode {
  const properties: Array<ASTNode> = [];
  const parent: ASTNode = {
    properties,
    type: 'ObjectExpression',
  };
  for (const key in obj) {
    properties.push({
      computed: false,
      key: {
        name: key,
        type: 'Identifier',
      },
      kind: 'init',
      shorthand: false,
      type: 'Property',
      value: {
        type: 'Literal',
        value: obj[key],
      },
    });
  }
  return parent;
}

export function isPropertyOrPropertyAccess(node: ASTNode, parent: ASTNode, propertyName: string) {
  const accessList = [];

  if (_CallExpression[node.type] && node.callee) {
    if (node.callee.name === propertyName) {
      return [propertyName];
    }
    if (node.callee.type === 'MemberExpression') {
      const obj = findObject(node.callee, accessList);
      accessList.unshift(propertyName);
      if (obj && obj.name === propertyName) return accessList;
    }
  }

  if (node.type === 'MemberExpression') {
    if (node.object && node.object.name === propertyName) {
      return [propertyName, node.property.name];
    }
    if (parent && parent.type !== 'MemberExpression') {
      if (node.property) accessList.unshift(node.property.name);
      let obj = findObject(node.object, accessList);

      if (obj && obj.name === propertyName) {
        accessList.unshift(propertyName);
        return accessList;
      }
    }
  }
}
