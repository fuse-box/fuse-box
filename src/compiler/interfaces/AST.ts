import { IASTScope } from '../Visitor/Visitor';

export interface ASTNode {
  raw?: string;
  type: keyof typeof ASTType;

  $assign_pattern?: boolean;
  $fuse_classInitializers?: Array<ASTNode>;
  $fuse_class_declaration_visited?: boolean;
  $fuse_decoratorForClassIdentifier?: string;
  $fuse_decoratorsCaptured?: boolean;
  $fuse_decoratorsProcessed?: boolean;
  $fuse_visited?: boolean;
  $transpiled?: boolean;
  alternate?: ASTNode;
  base?: ASTNode;
  chain?: ASTNode;
  consequent?: ASTNode;
  decorators?: Array<ASTNode>;
  definite?: boolean;
  elementTypes?: Array<ASTNode>;
  elements?: Array<ASTNode>;
  expressions?: Array<ASTNode>;
  initializer?: ASTNode;
  literal?: ASTNode;
  moduleReference?: ASTNode;
  optional?: boolean;
  prefix?: boolean;
  returnType?: ASTNode;
  scope?: IASTScope;
  shorthand?: boolean;
  source?: ASTNode;
  sourceType?: string;
  specifiers?: Array<ASTNode>;
  test?: ASTNode;
  typeAnnotation?: ASTNode;
  typeName?: ASTNode;
  loc?: { end: { column: number; line: number }; start: { column: number; line: number } };

  imported?: ASTNode;
  members?: Array<ASTNode>;
  method?: boolean;

  JSXElement?: ASTNode;

  abstract?: boolean;
  accessibility?: string;
  argument?: ASTNode;
  arguments?: Array<ASTNode>;
  async?: boolean;
  attributes?: Array<ASTNode>;
  body?: ASTNode | Array<ASTNode>;
  callee?: ASTNode;
  children?: Array<ASTNode>;
  closingElement?: ASTNode;
  computed?: boolean;
  declaration?: ASTNode;
  declarations?: Array<ASTNode>;
  declare?: boolean;
  exported?: ASTNode;
  expression?: any;
  generator?: boolean;
  id?: ASTNode;
  implements?: Array<ASTNode>;
  init?: null | ASTNode;
  key?: ASTNode;
  kind?: string;
  left?: ASTNode;
  local?: ASTNode;
  name?: any;
  object?: ASTNode;
  openingElement?: ASTNode;
  operator?: string;
  parameter?: ASTNode;
  params?: Array<ASTNode>;
  properties?: Array<ASTNode>;
  property?: ASTNode;
  quasi?: ASTNode;
  quasis?: Array<ASTNode>;
  right?: ASTNode;
  static?: boolean;
  superClass?: ASTNode;
  tag?: ASTNode;
  tail?: ASTNode;
  value?: any;
}

export const ASTType = {
  EnumDeclaration: 'TSEnumDeclaration',
  EnumMember: 'TSEnumMember',

  ParameterProperty: 'TSParameterProperty',
  StringKeyword: 'TSStringKeyword',
  TypeAnnotation: 'TSTypeAnnotation',

  AbstractClassProperty: 'TSAbstractClassProperty',
  AbstractMethodDefinition: 'TSAbstractMethodDefinition',
  AsExpression: 'TSAsExpression',
  DeclareFunction: 'TSDeclareFunction',
  DeclareKeyword: 'TSDeclareKeyword',
  InterfaceDeclaration: 'TSInterfaceDeclaration',
  NonNullExpression: 'TSNonNullExpression',
  TypeAliasDeclaration: 'TSTypeAliasDeclaration',
  TypeAssertion: 'TSTypeAssertion',

  ArrayExpression: 'ArrayExpression',
  ArrayPattern: 'ArrayPattern',
  ArrowFunctionExpression: 'ArrowFunctionExpression',
  AssignmentExpression: 'AssignmentExpression',
  AssignmentPattern: 'AssignmentPattern',
  AwaitExpression: 'AwaitExpression',
  BigIntLiteral: 'BigIntLiteral',
  BinaryExpression: 'BinaryExpression',
  Block: 'Block',
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
  HTMLClose: 'HTMLClose',
  HTMLOpen: 'HTMLOpen',
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
  Line: 'Line',
  Literal: 'Literal',
  LogicalExpression: 'LogicalExpression',
  MemberExpression: 'MemberExpression',
  MetaProperty: 'MetaProperty',
  MethodDefinition: 'MethodDefinition',
  NewExpression: 'NewExpression',
  ObjectExpression: 'ObjectExpression',
  ObjectPattern: 'ObjectPattern',
  OptionalCallExpression: 'OptionalCallExpression',
  OptionalMemberExpression: 'OptionalMemberExpression',
  Program: 'Program',
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
  module: 'module',
  script: 'script',

  AbstractKeyword: 'AbstractKeyword',

  AnyKeyword: 'TSAnyKeyword',
  ArrayType: 'TSArrayType',

  AsyncKeyword: 'AsyncKeyword',
  BigIntKeyword: 'BigIntKeyword',
  BooleanKeyword: 'TSBooleanKeyword',
  CallSignatureDeclaration: 'CallSignatureDeclaration',
  ClassImplements: 'ClassImplements',
  ConditionalType: 'ConditionalType',
  ConstructSignatureDeclaration: 'ConstructSignatureDeclaration',
  ConstructorType: 'ConstructorType',
  EmptyBodyFunctionExpression: 'EmptyBodyFunctionExpression',
  ExportAssignment: 'ExportAssignment',

  ExportKeyword: 'ExportKeyword',
  ExternalModuleReference: 'ExternalModuleReference',
  FunctionType: 'TSFunctionType',
  ImportEqualsDeclaration: 'TSImportEqualsDeclaration',
  ImportExpression: 'ImportExpression',
  ImportType: 'ImportType',
  IndexSignature: 'IndexSignature',
  IndexedAccessType: 'IndexedAccessType',
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
  PrivateKeyword: 'PrivateKeyword',
  PropertySignature: 'PropertySignature',
  ProtectedKeyword: 'ProtectedKeyword',
  PublicKeyword: 'PublicKeyword',
  QualifiedName: 'QualifiedName',
  ReadonlyKeyword: 'ReadonlyKeyword',
  RestType: 'RestType',
  StaticKeyword: 'StaticKeyword',

  SymbolKeyword: 'SymbolKeyword',
  ThisType: 'ThisType',
  TupleType: 'TSTupleType',

  JSDocNullableType: 'JSDocNullableType',
  JSDocUnknownType: 'JSDocUnknownType',
  TypeLiteral: 'TypeLiteral',
  TypeOperator: 'TypeOperator',
  TypeParameter: 'TypeParameter',
  TypeParameterDeclaration: 'TypeParameterDeclaration',
  TypeParameterInstantiation: 'TypeParameterInstantiation',
  TypePredicate: 'TypePredicate',
  TypeQuery: 'TypeQuery',
  TypeReference: 'TSTypeReference',
  UnaryExpression: 'UnaryExpression',
  UndefinedKeyword: 'TSUndefinedKeyword',
  UnionType: 'UnionType',
  UnknownKeyword: 'UnknownKeyword',
  UpdateExpression: 'UpdateExpression',
  VariableDeclaration: 'VariableDeclaration',
  VariableDeclarator: 'VariableDeclarator',
  VoidKeyword: 'TSVoidKeyword',
  WhileStatement: 'WhileStatement',
  WithStatement: 'WithStatement',
  YieldExpression: 'YieldExpression',
};
