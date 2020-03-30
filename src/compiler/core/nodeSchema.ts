import { ICompilerOptions } from '../../compilerOptions/interfaces';
import { ES_MODULE_EXPRESSION, isLocalIdentifier } from '../helpers/helpers';
import { ASTNode, ASTType } from '../interfaces/AST';
import { IVisitNodeProps } from './nodeVisitor';
import { scopeTracker, INodeScope, ISchemaRecord } from './scopeTracker';
import { SharedContext } from './sharedContext';

export interface ILocalIdentifier {
  isShorthand: boolean;
  name: string;
}

interface IRevisitOptions {
  forceRevisit?: boolean;
  stopPropagation?: boolean;
}
export interface ISchema {
  _childrenIgnored?: boolean;

  id?: number;
  ignoreChildren?: boolean;
  node?: ASTNode;
  parent?: ASTNode;
  property?: string;
  scope?: INodeScope;

  context: SharedContext;
  localIdentifier?: ILocalIdentifier;
  nodeScope?: INodeScope;
  state: IControllerTempState;
  bodyAppend: (nodes: Array<ASTNode>) => ISchema;
  bodyPrepend: (nodes: Array<ASTNode>) => ISchema;
  ensureESModuleStatement: (compilerOptions: ICompilerOptions) => any;
  getLocal?: (name: string) => ISchemaRecord;
  ignore?: () => ISchema;
  insertAfter: (nodes: Array<ASTNode>) => ISchema;
  remove: () => ISchema;
  replace: (nodes: ASTNode | Array<ASTNode>, options?: IRevisitOptions) => ISchema;
}

interface IControllerTempState {
  replace?: Array<ASTNode>;
}
export function createSchema(props: IVisitNodeProps, context: SharedContext): ISchema {
  const { node, parent, property } = props;
  const state: IControllerTempState = {};

  function revisit(nodes: Array<ASTNode>) {
    if (!props.avoidReVisit) {
      for (const node of nodes) context.visit({ ...props, ignoreChildren: false, node: node });
    }
  }
  const self: ISchema = {
    context,
    state,
    bodyAppend: (nodes: Array<ASTNode>) => {
      context._append.push(nodes);
      return self;
    },
    bodyPrepend: (nodes: Array<ASTNode>) => {
      context._prepend.push(nodes);
      return self;
    },
    ensureESModuleStatement: (compilerOptions: ICompilerOptions) => {
      if (compilerOptions.esModuleStatement && !context.esModuleStatementInjected) {
        context.esModuleStatementInjected = true;
        self.bodyPrepend([ES_MODULE_EXPRESSION]);
      }
      return self;
    },
    getLocal: (name: string) => {
      if (!self.nodeScope || self.nodeScope.length === 0) return;

      const total = self.nodeScope.length - 1;

      for (let i = total; i >= 0; i--) {
        const bodyScope = self.nodeScope[i];
        if (bodyScope[name] && bodyScope[name].node) return bodyScope[name];
      }

      return undefined;
    },
    ignore: () => {
      self._childrenIgnored = true;
      return self;
    },
    insertAfter: (nodes: Array<ASTNode>) => {
      context._insert.push({ nodes, schema: self });
      revisit(nodes);
      return self;
    },
    remove: () => {
      context._remove.push(self);
      self._childrenIgnored = true;
      return self;
    },
    replace: (nodes: ASTNode | Array<ASTNode>, options?: IRevisitOptions) => {
      nodes = [].concat(nodes);
      context._replace.push({ nodes, schema: self });

      self._childrenIgnored = true;

      let stopPropagation = false;
      if (options) {
        if (options.stopPropagation) stopPropagation = true;
        if (options.forceRevisit) {
          for (const node of nodes) context.visit({ ...props, ignoreChildren: false, node: node });
        }
      }
      if (!stopPropagation) revisit(nodes);
      return self;
    },
  };
  for (const i in props) self[i] = props[i];
  if (props.avoidScope) return self;

  let scope = props.scope;
  if (!scope) scope = [];

  let bodyScope = scopeTracker(self);

  let currentScope = [];
  if (bodyScope) {
    for (const x of scope) currentScope.push(x);
    currentScope.push(bodyScope);
  } else currentScope = scope;
  self.nodeScope = currentScope;

  // local identfier
  if (node.type === ASTType.ObjectPattern) {
    for (const item of node.properties) item.$assign_pattern = true;
  }
  let shorthand;
  if (node.type === ASTType.Property && node.shorthand === true && !node.$assign_pattern) {
    if (node.value && node.value.type === ASTType.Identifier) {
      shorthand = node.value;
    }
  }

  const _isLocalIdentifier = isLocalIdentifier(node, parent, property);
  if (_isLocalIdentifier || shorthand) {
    let nodeName;
    if (shorthand) nodeName = shorthand.name;
    else nodeName = node.name;
    self.localIdentifier = { isShorthand: !!shorthand, name: nodeName };
  }

  return self;
}
