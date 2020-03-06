// Astring is a tiny and fast JavaScript code generator from an ESTree-compliant AST.
//
// Astring was written by David Bonnet and released under an MIT license.
//
// The Git repository for Astring is available at:
// https://github.com/davidbonnet/astring.git
//
// Please use the GitHub bug tracker to report issues:
// https://github.com/davidbonnet/astring/issues

const { stringify } = JSON;

/* istanbul ignore if */
if (!String.prototype.repeat) {
  /* istanbul ignore next */
  throw new Error('String.prototype.repeat is undefined, see https://github.com/davidbonnet/astring#installation');
}

/* istanbul ignore if */
if (!String.prototype.endsWith) {
  /* istanbul ignore next */
  throw new Error('String.prototype.endsWith is undefined, see https://github.com/davidbonnet/astring#installation');
}

const OPERATOR_PRECEDENCE = {
  '!=': 8,
  '!==': 8,
  '%': 12,
  '&': 7,
  '&&': 4,
  '*': 12,
  '**': 13,
  '+': 11,
  '-': 11,
  '/': 12,
  '<': 9,
  '<<': 10,
  '<=': 9,
  '==': 8,
  '===': 8,
  '>': 9,
  '>=': 9,
  '>>': 10,
  '>>>': 10,
  '^': 6,
  in: 9,
  instanceof: 9,
  '|': 5,
  '||': 3,
};

// Enables parenthesis regardless of precedence
const NEEDS_PARENTHESES = 17;

const EXPRESSIONS_PRECEDENCE = {
  // Definitions
  ArrayExpression: 20,
  // Other definitions
  ArrowFunctionExpression: NEEDS_PARENTHESES,
  AssignmentExpression: 3,
  AwaitExpression: 2,
  BinaryExpression: 14,
  CallExpression: 19,
  ClassExpression: NEEDS_PARENTHESES,
  ConditionalExpression: 4,
  FunctionExpression: NEEDS_PARENTHESES,
  Identifier: 20,
  Literal: 18,
  LogicalExpression: 13,
  // Operations
  MemberExpression: 19,
  NewExpression: 19,
  ObjectExpression: NEEDS_PARENTHESES,
  RestElement: 1,
  SequenceExpression: 20,
  Super: 20,
  TaggedTemplateExpression: 20,
  TemplateLiteral: 20,
  ThisExpression: 20,
  UnaryExpression: 15,
  // Other operations
  UpdateExpression: 16,
  YieldExpression: 2,
};

function formatSequence(state, nodes) {
  /*
  Writes into `state` a sequence of `nodes`.
  */
  const { generator } = state;
  state.write('(');
  if (nodes != null && nodes.length > 0) {
    generator[nodes[0].type](nodes[0], state);
    const { length } = nodes;
    for (let i = 1; i < length; i++) {
      const param = nodes[i];
      state.write(', ');
      generator[param.type](param, state);
    }
  }
  state.write(')');
}

function expressionNeedsParenthesis(node, parentNode, isRightHand) {
  const nodePrecedence = EXPRESSIONS_PRECEDENCE[node.type];
  if (nodePrecedence === NEEDS_PARENTHESES) {
    return true;
  }
  const parentNodePrecedence = EXPRESSIONS_PRECEDENCE[parentNode.type];
  if (nodePrecedence !== parentNodePrecedence) {
    // Different node types
    return (
      (!isRightHand && nodePrecedence === 15 && parentNodePrecedence === 14 && parentNode.operator === '**') ||
      nodePrecedence < parentNodePrecedence
    );
  }
  if (nodePrecedence !== 13 && nodePrecedence !== 14) {
    // Not a `LogicalExpression` or `BinaryExpression`
    return false;
  }
  if (node.operator === '**' && parentNode.operator === '**') {
    // Exponentiation operator has right-to-left associativity
    return !isRightHand;
  }
  if (isRightHand) {
    // Parenthesis are used if both operators have the same precedence
    return OPERATOR_PRECEDENCE[node.operator] <= OPERATOR_PRECEDENCE[parentNode.operator];
  }
  return OPERATOR_PRECEDENCE[node.operator] < OPERATOR_PRECEDENCE[parentNode.operator];
}

function formatBinaryExpressionPart(state, node, parentNode, isRightHand) {
  /*
  Writes into `state` a left-hand or right-hand expression `node`
  from a binary expression applying the provided `operator`.
  The `isRightHand` parameter should be `true` if the `node` is a right-hand argument.
  */
  const { generator } = state;
  if (expressionNeedsParenthesis(node, parentNode, isRightHand)) {
    state.write('(');
    generator[node.type](node, state);
    state.write(')');
  } else {
    generator[node.type](node, state);
  }
}

function reindent(state, text, indent, lineEnd) {
  /*
  Writes into `state` the `text` string reindented with the provided `indent`.
  */
  const lines = text.split('\n');
  const end = lines.length - 1;
  state.write(lines[0].trim());
  if (end > 0) {
    state.write(lineEnd);
    for (let i = 1; i < end; i++) {
      state.write(indent + lines[i].trim() + lineEnd);
    }
    state.write(indent + lines[end].trim());
  }
}

function formatComments(state, comments, indent, lineEnd) {
  /*
  Writes into `state` the provided list of `comments`, with the given `indent` and `lineEnd` strings.
  Line comments will end with `"\n"` regardless of the value of `lineEnd`.
  Expects to start on a new unindented line.
  */
  const { length } = comments;
  for (let i = 0; i < length; i++) {
    const comment = comments[i];
    state.write(indent);
    if (comment.type[0] === 'L') {
      // Line comment
      state.write('// ' + comment.value.trim() + '\n');
    } else {
      // Block comment
      state.write('/*');
      reindent(state, comment.value, indent, lineEnd);
      state.write('*/' + lineEnd);
    }
  }
}

function hasCallExpression(node) {
  /*
  Returns `true` if the provided `node` contains a call expression and `false` otherwise.
  */
  let currentNode = node;
  while (currentNode != null) {
    const { type } = currentNode;
    if (type[0] === 'C' && type[1] === 'a') {
      // Is CallExpression
      return true;
    } else if (type[0] === 'M' && type[1] === 'e' && type[2] === 'm') {
      // Is MemberExpression
      currentNode = currentNode.object;
    } else {
      return false;
    }
  }
}

function formatVariableDeclaration(state, node) {
  /*
  Writes into `state` a variable declaration.
  */
  const { generator } = state;
  const { declarations } = node;
  state.write(node.kind + ' ');
  const { length } = declarations;
  if (length > 0) {
    generator.VariableDeclarator(declarations[0], state);
    for (let i = 1; i < length; i++) {
      state.write(', ');
      generator.VariableDeclarator(declarations[i], state);
    }
  }
}

let ForInStatement, FunctionDeclaration, RestElement, BinaryExpression, ArrayExpression, BlockStatement;

export const baseGenerator = {
  ArrayExpression: ArrayExpression = function(node, state) {
    state.write('[');
    if (node.elements.length > 0) {
      const { elements } = node,
        { length } = elements;
      for (let i = 0; ; ) {
        const element = elements[i];
        if (element != null) {
          this[element.type](element, state);
        }
        if (++i < length) {
          state.write(', ');
        } else {
          if (element == null) {
            state.write(', ');
          }
          break;
        }
      }
    }
    state.write(']');
  },
  ArrayPattern: ArrayExpression,
  ArrowFunctionExpression(node, state) {
    state.write(node.async ? 'async ' : '', node);
    const { params } = node;
    if (params != null) {
      // Omit parenthesis if only one named parameter
      if (params.length === 1 && params[0].type[0] === 'I') {
        // If params[0].type[0] starts with 'I', it can't be `ImportDeclaration` nor `IfStatement` and thus is `Identifier`
        state.write(params[0].name, params[0]);
      } else {
        formatSequence(state, node.params);
      }
    }
    state.write(' => ');
    if (node.body.type[0] === 'O') {
      // Body is an object expression
      state.write('(');
      this.ObjectExpression(node.body, state);
      state.write(')');
    } else {
      this[node.body.type](node.body, state);
    }
  },
  AssignmentExpression(node, state) {
    this[node.left.type](node.left, state);
    state.write(' ' + node.operator + ' ');
    this[node.right.type](node.right, state);
  },
  AssignmentPattern(node, state) {
    this[node.left.type](node.left, state);
    state.write(' = ');
    this[node.right.type](node.right, state);
  },
  AwaitExpression(node, state) {
    state.write('await ');
    if (node.argument) {
      this[node.argument.type](node.argument, state);
    }
  },
  BinaryExpression: BinaryExpression = function(node, state) {
    const isIn = node.operator === 'in';
    if (isIn) {
      // Avoids confusion in `for` loops initializers
      state.write('(');
    }
    formatBinaryExpressionPart(state, node.left, node, false);
    state.write(' ' + node.operator + ' ');
    formatBinaryExpressionPart(state, node.right, node, true);
    if (isIn) {
      state.write(')');
    }
  },
  BlockStatement: BlockStatement = function(node, state) {
    const indent = state.indent.repeat(state.indentLevel++);
    const { lineEnd, writeComments } = state;
    const statementIndent = indent + state.indent;
    state.write('{');
    const statements = node.body;
    if (statements != null && statements.length > 0) {
      state.write(lineEnd);
      if (writeComments && node.comments != null) {
        formatComments(state, node.comments, statementIndent, lineEnd);
      }
      const { length } = statements;
      for (let i = 0; i < length; i++) {
        const statement = statements[i];
        if (writeComments && statement.comments != null) {
          formatComments(state, statement.comments, statementIndent, lineEnd);
        }
        state.write(statementIndent);
        this[statement.type](statement, state);
        state.write(lineEnd);
      }
      state.write(indent);
    } else {
      if (writeComments && node.comments != null) {
        state.write(lineEnd);
        formatComments(state, node.comments, statementIndent, lineEnd);
        state.write(indent);
      }
    }
    if (writeComments && node.trailingComments != null) {
      formatComments(state, node.trailingComments, statementIndent, lineEnd);
    }
    state.write('}');
    state.indentLevel--;
  },
  BreakStatement(node, state) {
    state.write('break');
    if (node.label != null) {
      state.write(' ');
      this[node.label.type](node.label, state);
    }
    state.write(';');
  },
  CallExpression(node, state) {
    if (EXPRESSIONS_PRECEDENCE[node.callee.type] < EXPRESSIONS_PRECEDENCE.CallExpression) {
      state.write('(');
      this[node.callee.type](node.callee, state);
      state.write(')');
    } else {
      this[node.callee.type](node.callee, state);
    }
    formatSequence(state, node['arguments']);
  },
  ClassBody: BlockStatement,
  ClassDeclaration(node, state) {
    state.write('class ' + (node.id ? `${node.id.name} ` : ''), node);
    if (node.superClass) {
      state.write('extends ');
      this[node.superClass.type](node.superClass, state);
      state.write(' ');
    }
    this.ClassBody(node.body, state);
  },
  ClassExpression(node, state) {
    this.ClassDeclaration(node, state);
  },
  ConditionalExpression(node, state) {
    if (EXPRESSIONS_PRECEDENCE[node.test.type] > EXPRESSIONS_PRECEDENCE.ConditionalExpression) {
      this[node.test.type](node.test, state);
    } else {
      state.write('(');
      this[node.test.type](node.test, state);
      state.write(')');
    }
    state.write(' ? ');
    this[node.consequent.type](node.consequent, state);
    state.write(' : ');
    this[node.alternate.type](node.alternate, state);
  },
  ContinueStatement(node, state) {
    state.write('continue');
    if (node.label != null) {
      state.write(' ');
      this[node.label.type](node.label, state);
    }
    state.write(';');
  },
  DebuggerStatement(node, state) {
    state.write('debugger;' + state.lineEnd);
  },
  DoWhileStatement(node, state) {
    state.write('do ');
    this[node.body.type](node.body, state);
    state.write(' while (');
    this[node.test.type](node.test, state);
    state.write(');');
  },
  EmptyStatement(node, state) {
    state.write(';');
  },
  ExportAllDeclaration(node, state) {
    state.write('export * from ');
    this.Literal(node.source, state);
    state.write(';');
  },
  ExportDefaultDeclaration(node, state) {
    state.write('export default ');
    this[node.declaration.type](node.declaration, state);
    if (EXPRESSIONS_PRECEDENCE[node.declaration.type] && node.declaration.type[0] !== 'F') {
      // All expression nodes except `FunctionExpression`
      state.write(';');
    }
  },
  ExportNamedDeclaration(node, state) {
    state.write('export ');
    if (node.declaration) {
      this[node.declaration.type](node.declaration, state);
    } else {
      state.write('{');
      const { specifiers } = node,
        { length } = specifiers;
      if (length > 0) {
        for (let i = 0; ; ) {
          const specifier = specifiers[i];
          const { name } = specifier.local;
          state.write(name, specifier);
          if (name !== specifier.exported.name) {
            state.write(' as ' + specifier.exported.name);
          }
          if (++i < length) {
            state.write(', ');
          } else {
            break;
          }
        }
      }
      state.write('}');
      if (node.source) {
        state.write(' from ');
        this.Literal(node.source, state);
      }
      state.write(';');
    }
  },
  ExpressionStatement(node, state) {
    const precedence = EXPRESSIONS_PRECEDENCE[node.expression.type];
    if (precedence === NEEDS_PARENTHESES || (precedence === 3 && node.expression.left.type[0] === 'O')) {
      // Should always have parentheses or is an AssignmentExpression to an ObjectPattern
      state.write('(');
      this[node.expression.type](node.expression, state);
      state.write(')');
    } else {
      this[node.expression.type](node.expression, state);
    }
    state.write(';');
  },
  ForInStatement: ForInStatement = function(node, state) {
    state.write(`for ${node.await ? 'await ' : ''}(`);
    const { left } = node;
    if (left.type[0] === 'V') {
      formatVariableDeclaration(state, left);
    } else {
      this[left.type](left, state);
    }
    // Identifying whether node.type is `ForInStatement` or `ForOfStatement`
    state.write(node.type[3] === 'I' ? ' in ' : ' of ');
    this[node.right.type](node.right, state);
    state.write(') ');
    this[node.body.type](node.body, state);
  },
  ForOfStatement: ForInStatement,
  ForStatement(node, state) {
    state.write('for (');
    if (node.init != null) {
      const { init } = node;
      if (init.type[0] === 'V') {
        formatVariableDeclaration(state, init);
      } else {
        this[init.type](init, state);
      }
    }
    state.write('; ');
    if (node.test) {
      this[node.test.type](node.test, state);
    }
    state.write('; ');
    if (node.update) {
      this[node.update.type](node.update, state);
    }
    state.write(') ');
    this[node.body.type](node.body, state);
  },
  FunctionDeclaration: FunctionDeclaration = function(node, state) {
    state.write(
      (node.async ? 'async ' : '') + (node.generator ? 'function* ' : 'function ') + (node.id ? node.id.name : ''),
      node,
    );
    formatSequence(state, node.params);
    state.write(' ');
    this[node.body.type](node.body, state);
  },
  FunctionExpression: FunctionDeclaration,
  Identifier(node, state) {
    state.write(node.name, node);
  },
  IfStatement(node, state) {
    state.write('if (');
    this[node.test.type](node.test, state);
    state.write(') ');
    this[node.consequent.type](node.consequent, state);
    if (node.alternate != null) {
      state.write(' else ');
      this[node.alternate.type](node.alternate, state);
    }
  },
  ImportDeclaration(node, state) {
    state.write('import ');
    const { specifiers } = node;
    const { length } = specifiers;
    // NOTE: Once babili is fixed, put this after condition
    // https://github.com/babel/babili/issues/430
    let i = 0;
    if (length > 0) {
      for (; i < length; ) {
        if (i > 0) {
          state.write(', ');
        }
        const specifier = specifiers[i];
        const type = specifier.type[6];
        if (type === 'D') {
          // ImportDefaultSpecifier
          state.write(specifier.local.name, specifier);
          i++;
        } else if (type === 'N') {
          // ImportNamespaceSpecifier
          state.write('* as ' + specifier.local.name, specifier);
          i++;
        } else {
          // ImportSpecifier
          break;
        }
      }
      if (i < length) {
        state.write('{');
        for (;;) {
          const specifier = specifiers[i];
          const { name } = specifier.imported;
          state.write(name, specifier);
          if (name !== specifier.local.name) {
            state.write(' as ' + specifier.local.name);
          }
          if (++i < length) {
            state.write(', ');
          } else {
            break;
          }
        }
        state.write('}');
      }
      state.write(' from ');
    }
    this.Literal(node.source, state);
    state.write(';');
  },
  LabeledStatement(node, state) {
    this[node.label.type](node.label, state);
    state.write(': ');
    this[node.body.type](node.body, state);
  },
  Literal(node, state) {
    if (node.raw != null) {
      state.write(node.raw, node);
    } else if (node.regex != null) {
      this.RegExpLiteral(node, state);
    } else {
      state.write(stringify(node.value), node);
    }
  },
  LogicalExpression: BinaryExpression,
  MemberExpression(node, state) {
    if (EXPRESSIONS_PRECEDENCE[node.object.type] < EXPRESSIONS_PRECEDENCE.MemberExpression) {
      state.write('(');
      this[node.object.type](node.object, state);
      state.write(')');
    } else {
      this[node.object.type](node.object, state);
    }
    if (node.computed) {
      state.write('[');
      this[node.property.type](node.property, state);
      state.write(']');
    } else {
      state.write('.');
      this[node.property.type](node.property, state);
    }
  },
  MetaProperty(node, state) {
    state.write(node.meta.name + '.' + node.property.name, node);
  },
  MethodDefinition(node, state) {
    if (node.static) {
      state.write('static ');
    }
    const kind = node.kind[0];
    if (kind === 'g' || kind === 's') {
      // Getter or setter
      state.write(node.kind + ' ');
    }
    if (node.value.async) {
      state.write('async ');
    }
    if (node.value.generator) {
      state.write('*');
    }
    if (node.computed) {
      state.write('[');
      this[node.key.type](node.key, state);
      state.write(']');
    } else {
      this[node.key.type](node.key, state);
    }
    formatSequence(state, node.value.params);
    state.write(' ');
    this[node.value.body.type](node.value.body, state);
  },
  NewExpression(node, state) {
    state.write('new ');
    if (
      EXPRESSIONS_PRECEDENCE[node.callee.type] < EXPRESSIONS_PRECEDENCE.CallExpression ||
      hasCallExpression(node.callee)
    ) {
      state.write('(');
      this[node.callee.type](node.callee, state);
      state.write(')');
    } else {
      this[node.callee.type](node.callee, state);
    }
    formatSequence(state, node['arguments']);
  },
  ObjectExpression(node, state) {
    const indent = state.indent.repeat(state.indentLevel++);
    const { lineEnd, writeComments } = state;
    const propertyIndent = indent + state.indent;
    state.write('{');
    if (node.properties.length > 0) {
      state.write(lineEnd);
      if (writeComments && node.comments != null) {
        formatComments(state, node.comments, propertyIndent, lineEnd);
      }
      const comma = ',' + lineEnd;
      const { properties } = node,
        { length } = properties;
      for (let i = 0; ; ) {
        const property = properties[i];
        if (writeComments && property.comments != null) {
          formatComments(state, property.comments, propertyIndent, lineEnd);
        }
        state.write(propertyIndent);
        this[property.type](property, state);
        if (++i < length) {
          state.write(comma);
        } else {
          break;
        }
      }
      state.write(lineEnd);
      if (writeComments && node.trailingComments != null) {
        formatComments(state, node.trailingComments, propertyIndent, lineEnd);
      }
      state.write(indent + '}');
    } else if (writeComments) {
      if (node.comments != null) {
        state.write(lineEnd);
        formatComments(state, node.comments, propertyIndent, lineEnd);
        if (node.trailingComments != null) {
          formatComments(state, node.trailingComments, propertyIndent, lineEnd);
        }
        state.write(indent + '}');
      } else if (node.trailingComments != null) {
        state.write(lineEnd);
        formatComments(state, node.trailingComments, propertyIndent, lineEnd);
        state.write(indent + '}');
      } else {
        state.write('}');
      }
    } else {
      state.write('}');
    }
    state.indentLevel--;
  },
  ObjectPattern(node, state) {
    state.write('{');
    if (node.properties.length > 0) {
      const { properties } = node,
        { length } = properties;
      for (let i = 0; ; ) {
        this[properties[i].type](properties[i], state);
        if (++i < length) {
          state.write(', ');
        } else {
          break;
        }
      }
    }
    state.write('}');
  },
  Program(node, state) {
    const indent = state.indent.repeat(state.indentLevel);
    const { lineEnd, writeComments } = state;
    if (writeComments && node.comments != null) {
      formatComments(state, node.comments, indent, lineEnd);
    }
    const statements = node.body;
    const { length } = statements;
    for (let i = 0; i < length; i++) {
      const statement = statements[i];
      if (writeComments && statement.comments != null) {
        formatComments(state, statement.comments, indent, lineEnd);
      }
      state.write(indent);
      this[statement.type](statement, state);
      state.write(lineEnd);
    }
    if (writeComments && node.trailingComments != null) {
      formatComments(state, node.trailingComments, indent, lineEnd);
    }
  },
  Property(node, state) {
    if (node.method || node.kind[0] !== 'i') {
      // Either a method or of kind `set` or `get` (not `init`)
      this.MethodDefinition(node, state);
    } else {
      if (!node.shorthand) {
        if (node.computed) {
          state.write('[');
          this[node.key.type](node.key, state);
          state.write(']');
        } else {
          this[node.key.type](node.key, state);
        }
        state.write(': ');
      }
      this[node.value.type](node.value, state);
    }
  },
  RegExpLiteral(node, state) {
    const { regex } = node;
    state.write(`/${regex.pattern}/${regex.flags}`, node);
  },
  RestElement: RestElement = function(node, state) {
    state.write('...');
    this[node.argument.type](node.argument, state);
  },
  ReturnStatement(node, state) {
    state.write('return');
    if (node.argument) {
      state.write(' ');
      this[node.argument.type](node.argument, state);
    }
    state.write(';');
  },
  SequenceExpression(node, state) {
    formatSequence(state, node.expressions);
  },
  SpreadElement: RestElement,
  Super(node, state) {
    state.write('super', node);
  },
  SwitchStatement(node, state) {
    const indent = state.indent.repeat(state.indentLevel++);
    const { lineEnd, writeComments } = state;
    state.indentLevel++;
    const caseIndent = indent + state.indent;
    const statementIndent = caseIndent + state.indent;
    state.write('switch (');
    this[node.discriminant.type](node.discriminant, state);
    state.write(') {' + lineEnd);
    const { cases: occurences } = node;
    const { length: occurencesCount } = occurences;
    for (let i = 0; i < occurencesCount; i++) {
      const occurence = occurences[i];
      if (writeComments && occurence.comments != null) {
        formatComments(state, occurence.comments, caseIndent, lineEnd);
      }
      if (occurence.test) {
        state.write(caseIndent + 'case ');
        this[occurence.test.type](occurence.test, state);
        state.write(':' + lineEnd);
      } else {
        state.write(caseIndent + 'default:' + lineEnd);
      }
      const { consequent } = occurence;
      const { length: consequentCount } = consequent;
      for (let i = 0; i < consequentCount; i++) {
        const statement = consequent[i];
        if (writeComments && statement.comments != null) {
          formatComments(state, statement.comments, statementIndent, lineEnd);
        }
        state.write(statementIndent);
        this[statement.type](statement, state);
        state.write(lineEnd);
      }
    }
    state.indentLevel -= 2;
    state.write(indent + '}');
  },
  TaggedTemplateExpression(node, state) {
    this[node.tag.type](node.tag, state);
    this[node.quasi.type](node.quasi, state);
  },
  TemplateLiteral(node, state) {
    const { expressions, quasis } = node;
    state.write('`');
    const { length } = expressions;
    for (let i = 0; i < length; i++) {
      const expression = expressions[i];
      state.write(quasis[i].value.raw);
      state.write('${');
      this[expression.type](expression, state);
      state.write('}');
    }

    const cooked = quasis[quasis.length - 1].value.raw;
    const cookedLength = cooked.split('\n').length;
    const shift = cookedLength - 1;
    if (shift > 0) state.line = state.line + shift;

    state.write(cooked);
    state.write('`');
  },
  ThisExpression(node, state) {
    state.write('this', node);
  },
  ThrowStatement(node, state) {
    state.write('throw ');
    this[node.argument.type](node.argument, state);
    state.write(';');
  },
  TryStatement(node, state) {
    state.write('try ');
    this[node.block.type](node.block, state);
    if (node.handler) {
      const { handler } = node;
      if (handler.param == null) {
        state.write(' catch ');
      } else {
        state.write(' catch (');
        this[handler.param.type](handler.param, state);
        state.write(') ');
      }
      this[handler.body.type](handler.body, state);
    }
    if (node.finalizer) {
      state.write(' finally ');
      this[node.finalizer.type](node.finalizer, state);
    }
  },
  UnaryExpression(node, state) {
    if (node.prefix) {
      state.write(node.operator);
      if (node.operator.length > 1) {
        state.write(' ');
      }
      if (EXPRESSIONS_PRECEDENCE[node.argument.type] < EXPRESSIONS_PRECEDENCE.UnaryExpression) {
        state.write('(');
        this[node.argument.type](node.argument, state);
        state.write(')');
      } else {
        this[node.argument.type](node.argument, state);
      }
    } else {
      // FIXME: This case never occurs
      this[node.argument.type](node.argument, state);
      state.write(node.operator);
    }
  },
  UpdateExpression(node, state) {
    // Always applied to identifiers or members, no parenthesis check needed
    if (node.prefix) {
      state.write(node.operator);
      this[node.argument.type](node.argument, state);
    } else {
      this[node.argument.type](node.argument, state);
      state.write(node.operator);
    }
  },
  VariableDeclaration(node, state) {
    formatVariableDeclaration(state, node);
    state.write(';');
  },
  VariableDeclarator(node, state) {
    if (!node.id) return;
    this[node.id.type](node.id, state);
    if (node.init != null) {
      state.write(' = ');
      this[node.init.type](node.init, state);
    }
  },
  WhileStatement(node, state) {
    state.write('while (');
    this[node.test.type](node.test, state);
    state.write(') ');
    this[node.body.type](node.body, state);
  },
  WithStatement(node, state) {
    state.write('with (');
    this[node.object.type](node.object, state);
    state.write(') ');
    this[node.body.type](node.body, state);
  },
  YieldExpression(node, state) {
    state.write(node.delegate ? 'yield*' : 'yield');
    if (node.argument) {
      state.write(' ');
      this[node.argument.type](node.argument, state);
    }
  },
};

const EMPTY_OBJECT = {};

class State {
  output: any;
  writeComments: boolean;
  indent: string;

  lineEnd: string;
  indentLevel: string;
  generator: any;
  sourceMap: any;
  line: number;
  column: number;
  lineEndSize: number;
  mapping: any;
  constructor(options) {
    const setup = options == null ? EMPTY_OBJECT : options;
    this.output = '';
    // Functional options
    if (setup.output != null) {
      this.output = setup.output;
      this.write = this.writeToStream;
    } else {
      this.output = '';
    }
    this.generator = setup.generator != null ? setup.generator : baseGenerator;
    // Formating setup
    this.indent = setup.indent != null ? setup.indent : '  ';
    this.lineEnd = setup.lineEnd != null ? setup.lineEnd : '\n';
    this.indentLevel = setup.startingIndentLevel != null ? setup.startingIndentLevel : 0;
    this.writeComments = setup.comments ? setup.comments : false;
    // Source map
    if (setup.sourceMap != null) {
      const self: any = this;
      self.write = setup.output == null ? this.writeAndMap : this.writeToStreamAndMap;
      this.sourceMap = setup.sourceMap;
      this.line = 1;
      this.column = 0;
      this.lineEndSize = this.lineEnd.split('\n').length - 1;
      this.mapping = {
        generated: this,
        name: undefined,
        original: null,
        source: setup.sourceMap.file || setup.sourceMap._file,
      };
    }
  }

  write(code) {
    this.output += code;
  }

  writeToStream(code: any) {
    this.output.write(code);
  }

  writeAndMap(code, node) {
    this.output += code;
    this.map(code, node);
  }

  writeToStreamAndMap(code, node) {
    this.output.write(code);
    this.map(code, node);
  }

  map(code, node) {
    if (node != null && node.loc != null) {
      const { mapping } = this;
      mapping.original = node.loc.start;
      mapping.name = node.name;
      this.sourceMap.addMapping(mapping);
    }
    let debug = false;
    if (code && code.length > 0) {
      if (this.lineEndSize > 0) {
        if (code.endsWith(this.lineEnd)) {
          this.line += this.lineEndSize;

          this.column = 0;
        } else if (code[code.length - 1] === '\n') {
          // Case of inline comment
          this.line++;

          this.column = 0;
        } else {
          if (debug) {
            console.log('here');
          }
          this.column += code.length;
        }
      } else {
        if (code[code.length - 1] === '\n') {
          // Case of inline comment
          this.line++;
          this.column = 0;
        } else {
          this.column += code.length;
        }
      }
    }
  }

  toString() {
    return this.output;
  }
}

export function generate(node, options) {
  /*
  Returns a string representing the rendered code of the provided AST `node`.
  The `options` are:

  - `indent`: string to use for indentation (defaults to `␣␣`)
  - `lineEnd`: string to use for line endings (defaults to `\n`)
  - `startingIndentLevel`: indent level to start from (defaults to `0`)
  - `comments`: generate comments if `true` (defaults to `false`)
  - `output`: output stream to write the rendered code to (defaults to `null`)
  - `generator`: custom code generator (defaults to `baseGenerator`)
  */
  const state = new State(options);
  // Travel through the AST node and generate the code
  //  console.log(node, node.type);

  state.generator[node.type](node, state);
  return state.output;
}
