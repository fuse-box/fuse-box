import { ASTNode } from '../interfaces/AST';

const _isLocalIdentifierRulesExceptionNodes = {
  ImportSpecifier: 1,
  ImportDeclaration: 1,
  ImportNamespaceSpecifier: 1,
  TypeReference: 1,
  FunctionDeclaration: 1,
  ClassDeclaration: 1,
  FunctionExpression: 1,
  ImportDefaultSpecifier: 1,
};
export function isLocalIdentifier(node: ASTNode, parent?: ASTNode) {
  if (node.type === 'Identifier' && parent && !_isLocalIdentifierRulesExceptionNodes[parent.type]) {
    return (parent.computed === true || (parent.property !== node && !parent.computed)) && parent.key !== node;
  }
}

export function isDefinedLocally(node: ASTNode): Array<string> {
  if (node.id && node.id.name) {
    return [node.id.name];
  }
  if (node.type === 'VariableDeclaration') {
    const defined = [];
    if (node.declarations) {
      for (const decl of node.declarations) {
        if (decl.type === 'VariableDeclarator' && decl.id && decl.id.type === 'Identifier') {
          defined.push(decl.id.name);
        }
      }
    }
    return defined;
  }
}

export function createMemberExpression(obj: string, target: string): ASTNode {
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

export function createExpressionStatement(left: ASTNode, right: ASTNode) {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      left: left,
      operator: '=',
      right: right,
    },
  };
}
export function defineVariable(name: string, right: ASTNode): ASTNode {
  return {
    type: 'VariableDeclaration',
    kind: 'var',
    declarations: [
      {
        type: 'VariableDeclarator',
        init: right,
        id: {
          type: 'Identifier',
          name: name,
        },
      },
    ],
  };
}

export function createLiteral(value): ASTNode {
  return { type: 'Literal', value };
}
export function createExports(exportsKey: string, exportsVariableName: string, property: ASTNode): ASTNode {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: exportsKey,
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

export function createRequireStatement(source: string, local?: string): { reqStatement: ASTNode; statement: ASTNode } {
  const reqStatement: ASTNode = {
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
      reqStatement,
      statement: {
        type: 'ExpressionStatement',
        expression: reqStatement,
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
            type: 'Identifier',
            name: local,
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

export function createASTFromObject(obj: { [key: string]: any }): ASTNode {
  const properties: Array<ASTNode> = [];
  const parent: ASTNode = {
    type: 'ObjectExpression',
    properties,
  };
  for (const key in obj) {
    properties.push({
      type: 'Property',
      key: {
        type: 'Identifier',
        name: key,
      },
      value: {
        type: 'Literal',
        value: obj[key],
      },
      kind: 'init',
      computed: false,
      shorthand: false,
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
