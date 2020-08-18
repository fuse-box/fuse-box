import { ASTNode } from '../interfaces/AST';
import { createSchema, ISchema } from './nodeSchema';
import { INodeScope } from './scopeTracker';
import { SharedContext, createSharedContext, ISharedContextOverrides } from './sharedContext';
import { ITransformModuleProps } from './transformModule';

export interface INodeVisitorProps {
  ast: ASTNode;
  contextOverrides?: ISharedContextOverrides;
  visitorProps: ITransformModuleProps;
  fn: (schema: ISchema) => any;
  programBodyFn?: (schema: ISchema) => any;
}

export interface IVisitNodeProps {
  avoidReVisit?: boolean;
  avoidScope?: boolean;
  id?: number;
  ignoreChildren?: boolean;
  node?: ASTNode;
  parent?: ASTNode;
  property?: string;
  scope?: INodeScope;
  skipPreact?: boolean;
  userFunc?: (schema: ISchema) => any;
}

const IRNOGED_TYPES = {
  ClassImplements: 1,
  decorators: 1,
  superTypeParameters: 1,
  typeAnnotation: 1,
  typeParameters: 1,
};

const IGNORED_KEYS = {
  decorators: 1,
  returnType: 1,
  typeAnnotation: 1,
  typeParameters: 1,
};

export function nodeVisitor(rootProps: INodeVisitorProps) {
  let userFunc = rootProps.fn;

  const sharedContext: SharedContext = createSharedContext({ root: rootProps.ast, rootProps, visitFn: visitNode });
  const contextOverrides = rootProps.contextOverrides;
  if (contextOverrides) {
    for (const key in contextOverrides) sharedContext[key] = contextOverrides[key];
  }
  const root: ASTNode = rootProps.ast;
  function visitNode(props: IVisitNodeProps) {
    let { node, scope } = props;
    if (!scope) scope = [];

    // define scope
    const schema = createSchema(props, sharedContext);

    sharedContext.preAct(schema);
    userFunc(schema);

    if (props.ignoreChildren || schema._childrenIgnored) return;
    // deep iterations
    for (const property in node) {
      if (property[0] === '$' || IGNORED_KEYS[property] === 1) {
        continue;
      }
      const child = node[property];
      if (Array.isArray(child)) {
        let i = 0;
        while (i < child.length) {
          const item = child[i];

          if (item && item.type && !IRNOGED_TYPES[item.type]) {
            visitNode({ id: i, node: item, parent: node, property, scope: schema.nodeScope });
          }
          i++;
        }
      } else {
        if (child && child.type && !IRNOGED_TYPES[child.type]) {
          visitNode({ node: child, parent: node, property, scope: schema.nodeScope });
        }
      }
    }
  }

  if (rootProps.programBodyFn) {
    // program body traversal
    const body = root.body as Array<ASTNode>;

    for (const item of body) {
      const schema = createSchema(
        { avoidReVisit: true, avoidScope: true, ignoreChildren: true, node: item, parent: root, property: 'body' },
        sharedContext,
      );
      rootProps.programBodyFn(schema);
    }
    sharedContext.transform();
  }

  visitNode({ node: root });
  sharedContext.finalize();
  sharedContext.transform();

  return sharedContext;
}
