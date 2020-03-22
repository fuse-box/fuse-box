import { generateModuleNameFromSource } from '../helpers/astHelpers';
import { createMemberExpression } from '../helpers/helpers';
import { ASTNode, ASTType } from '../interfaces/AST';
import { ISchema } from './nodeSchema';
import { INodeVisitorProps, IVisitNodeProps } from './nodeVisitor';
import { transformModule } from './transformModule';

export interface ISharedContextProps {
  root: ASTNode;
  rootProps: INodeVisitorProps;
  visitFn: (x: IVisitNodeProps) => any;
}

interface INodeOperation {
  nodes: Array<ASTNode>;
  schema: ISchema;
}
type IRefInterceptor = (schema: ISchema) => any;

const REF_ALLOWED = {
  [ASTType.ImportDefaultSpecifier]: 1,
  [ASTType.ImportNamespaceSpecifier]: 1,
  [ASTType.ImportSpecifier]: 1,
};
export type ISharedContextOverrides = Record<string, any>;

export interface IFork {
  contextOverrides?: ISharedContextOverrides;
  root: ASTNode;
}
export class SharedContext {
  private localRefListeners = new Map<string, Array<IRefInterceptor>>();
  private onCompleteCallbacks = [];
  private variableCounter = 0;
  constructor(public props: ISharedContextProps) {}

  esModuleStatementInjected = false;

  moduleExportsName = 'exports';

  jsxFactory?: string;

  // main visit function
  visit = this.props.visitFn;

  sourceReferences = {};

  fork = (props: IFork) => {
    const options = this.props.rootProps.visitorProps;
    transformModule({ ...options, ...props });
  };

  getModuleName(source) {
    return generateModuleNameFromSource(source, this.sourceReferences);
  }

  getNextSystemVariable = () => `_${[++this.variableCounter]}_`;

  preAct(schema: ISchema) {
    const localIdentifier = schema.localIdentifier;

    if (localIdentifier) {
      const { replace } = schema;
      const listeners = this.localRefListeners.get(localIdentifier.name);
      if (listeners) {
        for (const listener of listeners) listener(schema);
      }

      // core replacements
      // related to Import and Export transformer
      const traced = this.coreReplacements[localIdentifier.name];

      if (traced && traced.first) {
        const origin = schema.getLocal(localIdentifier.name);

        if (!origin || (origin && REF_ALLOWED[origin.node.type])) {
          traced.inUse = true;

          if (traced.first === localIdentifier.name) {
            return;
          }

          const statement: ASTNode = traced.second
            ? createMemberExpression(traced.first, traced.second)
            : { name: traced.first, type: 'Identifier' };
          if (localIdentifier.isShorthand) {
            schema.node.shorthand = false;
            schema.node.value = statement;
            return replace(schema.node);
          }
          if (statement.object) statement.object.loc = schema.node.loc;

          return replace(statement);
        }
      }
    }
  }

  coreReplacements: Record<string, { first: string; second?: string; inUse?: boolean }> = {};

  _replace: Array<INodeOperation> = [];
  _insert: Array<INodeOperation> = [];
  _remove: Array<ISchema> = [];
  _prepend: Array<Array<ASTNode>> = [];
  _append: Array<Array<ASTNode>> = [];

  onRef = (name: string, fn: IRefInterceptor) => {
    let list = this.localRefListeners.get(name);
    if (!list) {
      list = [];
      this.localRefListeners.set(name, list);
    }
    list.push(fn);
  };

  onComplete = (fn: () => any, priority?: number) => {
    if (priority !== undefined) {
      this.onCompleteCallbacks.splice(priority, 0, fn);
    } else this.onCompleteCallbacks.push(fn);
  };

  finalize = () => {
    for (const complete of this.onCompleteCallbacks) complete();
  };

  transform = () => {
    const programBody = this.props.root.body as Array<ASTNode>;

    for (const item of this._replace) {
      const { node, parent, property } = item.schema;
      if (property && parent) {
        if (parent[property] instanceof Array) {
          const index = parent[property].indexOf(node);
          if (index > -1) {
            parent[property].splice(index, 1, ...item.nodes);
          }
        } else {
          parent[property] = item.nodes[0];
        }
      }
    }

    for (const item of this._insert) {
      const { node, parent, property } = item.schema;
      if (property && parent) {
        if (parent[property] instanceof Array) {
          const index = parent[property].indexOf(node);

          if (index > -1) parent[property].splice(index + 1, 0, ...item.nodes);
        } else parent[property] = item.nodes[0];
      }
    }

    for (const item of this._remove) {
      const { node, parent, property } = item;
      if (property && parent) {
        if (parent[property] instanceof Array) {
          const index = parent[property].indexOf(node);
          if (index > -1) parent[property].splice(index, 1);
        }
      }
    }

    let index = 0;
    while (index < this._prepend.length) {
      programBody.splice(index, 0, ...this._prepend[index]);
      index++;
    }

    for (const item of this._append) {
      for (const c of item) programBody.push(c);
    }

    this._append = [];
    this._insert = [];
    this._prepend = [];
    this._remove = [];
    this._replace = [];
  };
}
export function createSharedContext(props: ISharedContextProps): SharedContext {
  return new SharedContext(props);
}
