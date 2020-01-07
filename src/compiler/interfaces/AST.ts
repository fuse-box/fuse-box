import { IASTScope } from '../Visitor/Visitor';

export interface ASTNode {
  type: keyof typeof ASTType;

  $fuse_classInitializers?: Array<ASTNode>;
  $fuse_decoratorsCaptured?: boolean;
  $fuse_visited?: boolean;
  $fuse_class_declaration_visited?: boolean;
  $fuse_decoratorsProcessed?: boolean;
  $assign_pattern?: boolean;
  $fuse_decoratorForClassIdentifier?: string;
  typeAnnotation?: ASTNode;
  moduleReference?: ASTNode;
  chain?: ASTNode;
  base?: ASTNode;
  literal?: ASTNode;
  typeName?: ASTNode;
  $transpiled?: boolean;
  expressions?: Array<ASTNode>;
  elementTypes?: Array<ASTNode>;
  elements?: Array<ASTNode>;
  alternate?: ASTNode;
  scope?: IASTScope;
  prefix?: boolean;
  decorators?: Array<ASTNode>;
  loc?: { start: { line: number; column: number }; end: { line: number; column: number } };
  consequent?: ASTNode;
  shorthand?: boolean;
  specifiers?: Array<ASTNode>;
  test?: ASTNode;
  initializer?: ASTNode;
  returnType?: ASTNode;

  imported?: ASTNode;
  source?: ASTNode;
  method?: boolean;
  members?: Array<ASTNode>;

  JSXElement?: ASTNode;

  children?: Array<ASTNode>;
  attributes?: Array<ASTNode>;
  openingElement?: ASTNode;
  closingElement?: ASTNode;
  argument?: ASTNode;

  local?: ASTNode;
  exported?: ASTNode;
  name?: any;
  kind?: string;
  init?: null | ASTNode;
  declarations?: Array<ASTNode>;
  declaration?: ASTNode;
  id?: ASTNode;
  body?: Array<ASTNode> | ASTNode;
  expression?: any;
  callee?: ASTNode;
  params?: Array<ASTNode>;
  async?: boolean;
  generator?: boolean;
  arguments?: Array<ASTNode>;
  operator?: string;
  left?: ASTNode;
  right?: ASTNode;
  value?: any;
  key?: ASTNode;
  abstract?: boolean;
  properties?: Array<ASTNode>;
  object?: ASTNode;
  property?: ASTNode;
  declare?: boolean;
  implements?: Array<ASTNode>;
  superClass?: ASTNode;
  static?: boolean;
  computed?: boolean;
  accessibility?: string;
  parameter?: ASTNode;
}

export const ASTType = {
  EnumDeclaration: 'TSEnumDeclaration',
  EnumMember: 'TSEnumMember',

  ParameterProperty: 'TSParameterProperty',
  TypeAnnotation: 'TSTypeAnnotation',
  StringKeyword: 'TSStringKeyword',

  AsExpression: 'TSAsExpression',
  DeclareFunction: 'TSDeclareFunction',
  DeclareKeyword: 'TSDeclareKeyword',
  AbstractMethodDefinition: 'TSAbstractMethodDefinition',
  TypeAliasDeclaration: 'TSTypeAliasDeclaration',
  InterfaceDeclaration: 'TSInterfaceDeclaration',
  AbstractClassProperty: 'TSAbstractClassProperty',
  TypeAssertion: 'TSTypeAssertion',
  NonNullExpression: 'TSNonNullExpression',

  OptionalExpression: 'OptionalExpression',
  OptionalChain: 'OptionalChain',
  Line: 'Line',
  Block: 'Block',
  HTMLOpen: 'HTMLOpen',
  HTMLClose: 'HTMLClose',
  ArrayExpression: 'ArrayExpression',
  ArrayPattern: 'ArrayPattern',
  ArrowFunctionExpression: 'ArrowFunctionExpression',
  AssignmentExpression: 'AssignmentExpression',
  AssignmentPattern: 'AssignmentPattern',
  AwaitExpression: 'AwaitExpression',
  BigIntLiteral: 'BigIntLiteral',
  BinaryExpression: 'BinaryExpression',
  BlockStatement: 'BlockStatement',
  BreakStatement: 'BreakStatement',
  CallExpression: 'CallExpression',
  CatchClause: 'CatchClause',
  ClassBody: 'ClassBody',
  ClassDeclaration: 'ClassDeclaration',
  ClassExpression: 'ClassExpression',
  ClassProperty: 'ClassProperty',
  ConditionalExpression: 'ConditionalExpression',
  ContinueStatement: 'ContinueStatement',
  DebuggerStatement: 'DebuggerStatement',
  Decorator: 'Decorator',
  DoWhileStatement: 'DoWhileStatement',
  EmptyStatement: 'EmptyStatement',
  ExportAllDeclaration: 'ExportAllDeclaration',
  ExportDefaultDeclaration: 'ExportDefaultDeclaration',
  ExportNamedDeclaration: 'ExportNamedDeclaration',
  ExportSpecifier: 'ExportSpecifier',
  ExpressionStatement: 'ExpressionStatement',
  ForInStatement: 'ForInStatement',
  ForOfStatement: 'ForOfStatement',
  ForStatement: 'ForStatement',
  FunctionDeclaration: 'FunctionDeclaration',
  FunctionExpression: 'FunctionExpression',
  Identifier: 'Identifier',
  IfStatement: 'IfStatement',
  Import: 'Import',
  ImportDeclaration: 'ImportDeclaration',
  ImportDefaultSpecifier: 'ImportDefaultSpecifier',
  ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
  ImportSpecifier: 'ImportSpecifier',
  JSXAttribute: 'JSXAttribute',
  JSXClosingElement: 'JSXClosingElement',
  JSXClosingFragment: 'JSXClosingFragment',
  JSXElement: 'JSXElement',
  JSXEmptyExpression: 'JSXEmptyExpression',
  JSXExpressionContainer: 'JSXExpressionContainer',
  JSXFragment: 'JSXFragment',
  JSXIdentifier: 'JSXIdentifier',
  JSXMemberExpression: 'JSXMemberExpression',
  JSXOpeningElement: 'JSXOpeningElement',
  JSXOpeningFragment: 'JSXOpeningFragment',
  JSXSpreadAttribute: 'JSXSpreadAttribute',
  JSXSpreadChild: 'JSXSpreadChild',
  JSXText: 'JSXText',
  LabeledStatement: 'LabeledStatement',
  Literal: 'Literal',
  LogicalExpression: 'LogicalExpression',
  MemberExpression: 'MemberExpression',
  MetaProperty: 'MetaProperty',
  MethodDefinition: 'MethodDefinition',
  NewExpression: 'NewExpression',
  ObjectExpression: 'ObjectExpression',
  ObjectPattern: 'ObjectPattern',
  Program: 'Program',
  module: 'module',
  script: 'script',
  Property: 'Property',
  RestElement: 'RestElement',
  ReturnStatement: 'ReturnStatement',
  SequenceExpression: 'SequenceExpression',
  SpreadElement: 'SpreadElement',
  Super: 'Super',
  SwitchCase: 'SwitchCase',
  SwitchStatement: 'SwitchStatement',
  TaggedTemplateExpression: 'TaggedTemplateExpression',
  TemplateElement: 'TemplateElement',
  TemplateLiteral: 'TemplateLiteral',
  ThisExpression: 'ThisExpression',
  ThrowStatement: 'ThrowStatement',
  TryStatement: 'TryStatement',

  AbstractKeyword: 'AbstractKeyword',

  AnyKeyword: 'TSAnyKeyword',
  ArrayType: 'TSArrayType',

  AsyncKeyword: 'AsyncKeyword',
  BigIntKeyword: 'BigIntKeyword',
  BooleanKeyword: 'TSBooleanKeyword',
  CallSignatureDeclaration: 'CallSignatureDeclaration',
  ClassImplements: 'ClassImplements',
  ConditionalType: 'ConditionalType',
  ConstructorType: 'ConstructorType',
  ConstructSignatureDeclaration: 'ConstructSignatureDeclaration',

  EmptyBodyFunctionExpression: 'EmptyBodyFunctionExpression',

  ExportAssignment: 'ExportAssignment',
  ExportKeyword: 'ExportKeyword',
  ExternalModuleReference: 'ExternalModuleReference',
  FunctionType: 'TSFunctionType',
  ImportExpression: 'ImportExpression',
  ImportEqualsDeclaration: 'TSImportEqualsDeclaration',
  ImportType: 'ImportType',
  IndexedAccessType: 'IndexedAccessType',
  IndexSignature: 'IndexSignature',
  InferType: 'InferType',

  InterfaceBody: 'InterfaceBody',
  InterfaceHeritage: 'InterfaceHeritage',
  IntersectionType: 'IntersectionType',
  LiteralType: 'TSLiteralType',
  MappedType: 'MappedType',
  MethodSignature: 'MethodSignature',
  ModuleBlock: 'ModuleBlock',
  ModuleDeclaration: 'TSModuleDeclaration',
  NamespaceExportDeclaration: 'NamespaceExportDeclaration',
  NeverKeyword: 'TSNeverKeyword',

  NullKeyword: 'TSNullKeyword',
  NumberKeyword: 'TSNumberKeyword',
  ObjectKeyword: 'ObjectKeyword',
  OptionalType: 'OptionalType',

  ParenthesizedType: 'ParenthesizedType',
  PropertySignature: 'PropertySignature',
  PublicKeyword: 'PublicKeyword',
  PrivateKeyword: 'PrivateKeyword',
  ProtectedKeyword: 'ProtectedKeyword',
  QualifiedName: 'QualifiedName',
  ReadonlyKeyword: 'ReadonlyKeyword',
  RestType: 'RestType',
  StaticKeyword: 'StaticKeyword',

  SymbolKeyword: 'SymbolKeyword',
  ThisType: 'ThisType',
  TupleType: 'TSTupleType',

  TypeLiteral: 'TypeLiteral',
  TypeOperator: 'TypeOperator',
  TypeParameter: 'TypeParameter',
  TypeParameterDeclaration: 'TypeParameterDeclaration',
  TypeParameterInstantiation: 'TypeParameterInstantiation',
  TypePredicate: 'TypePredicate',
  JSDocNullableType: 'JSDocNullableType',
  JSDocUnknownType: 'JSDocUnknownType',
  TypeQuery: 'TypeQuery',
  TypeReference: 'TSTypeReference',
  UndefinedKeyword: 'TSUndefinedKeyword',
  UnionType: 'UnionType',
  UnknownKeyword: 'UnknownKeyword',
  VoidKeyword: 'TSVoidKeyword',
  UpdateExpression: 'UpdateExpression',
  UnaryExpression: 'UnaryExpression',
  VariableDeclaration: 'VariableDeclaration',
  VariableDeclarator: 'VariableDeclarator',
  WhileStatement: 'WhileStatement',
  WithStatement: 'WithStatement',
  YieldExpression: 'YieldExpression',
};
