import { createModuleExports, createRequireStatement } from '../transformUtils';
import { IFastTransformProps } from './fastTransform';
import { handleTracedImportSpecifiers } from './tracedVariable';

export interface ITransformContext {
  undefinedExports: Array<string>;
  toReplace: (parent, prop, idx, replacement) => void;
  toBeRemoved: Array<{ arr: any; node: any }>;
  tracedImportSpecifiers: {
    [key: string]: { alias?: string; replaceWithLocal?: boolean; local: string; nodes: Array<any> };
  };
  interceptSource: (string) => string;
  imported?: Array<{ local: any; exported: any }>;
  slicedExports?: Array<{ body: any; afterNode: any; local: any; exported: any }>;
  exported: Array<{ local: any; exported: any }>;
  reqStatements: Array<{
    replaceNode?: { array: Array<any>; node: any };
    local: string;
    source: string;
    localVariables?: Array<{ local: any; exported: any }>;
  }>;
  generateName: () => string;
  toRemove: (arr: any, node: any) => void;
  postWork: (ast) => void;
}

function _sliceExports(ctx: ITransformContext) {
  for (const item of ctx.slicedExports) {
    const index = item.body.indexOf(item.afterNode);
    item.body.splice(
      index + 1,
      0,
      createModuleExports(
        item.exported,
        typeof item.local === 'string'
          ? {
              type: 'Identifier',
              name: item.local,
            }
          : item.local,
      ),
    );
  }
}

function _removeNodes(ctx: ITransformContext) {
  ctx.toBeRemoved.forEach(item => {
    const index = item.arr.indexOf(item.node);
    if (index > -1) item.arr.splice(index, 1);
  });
}

function _addExports(ast, ctx: ITransformContext) {
  ctx.exported.forEach(item => {
    ast.body.push(
      createModuleExports(
        item.exported,
        typeof item.local === 'string'
          ? {
              type: 'Identifier',
              name: item.local,
            }
          : item.local,
      ),
    );
  });
}

function _handleRequireStatements(ast, ctx: ITransformContext) {
  ctx.reqStatements.forEach(item => {
    if (item.replaceNode) {
      const tree = item.replaceNode.array;
      const index = tree.indexOf(item.replaceNode.node);
      if (index > -1) {
        tree[index] = createRequireStatement(item.local, ctx.interceptSource(item.source));
      }
    } else {
      ast.body.unshift(createRequireStatement(item.local, ctx.interceptSource(item.source)));
    }
  });
}

function _replaceNodes(obj) {
  for (const item of obj.toBeReplaced) {
    const { parent, prop, idx, replacement } = item;
    if (idx) {
      parent[prop][idx] = replacement;
    } else {
      parent[prop] = replacement;
    }
  }
}
export function createTransformContext(props: IFastTransformProps) {
  let nameIndex = 0;
  const obj = {
    toBeReplaced: [],
    toBeRemoved: [],
    undefinedExports: [],
    tracedImportSpecifiers: {},
    exported: [],
    slicedExports: [],
    reqStatements: [],
    toReplace: (parent, prop, idx, replacement) => {
      obj.toBeReplaced.push({ parent, prop, idx, replacement });
    },
    interceptSource: source => {
      if (!props.sourceInterceptor) {
        return source;
      }
      return props.sourceInterceptor(source);
    },
    toRemove: (arr, node) => {
      obj.toBeRemoved.push({ arr, node });
    },
    generateName: () => {
      nameIndex++;
      return `__req${nameIndex}__`;
    },
    postWork: ast => {
      _handleRequireStatements(ast, obj);
      handleTracedImportSpecifiers(obj);
      _sliceExports(obj);
      _addExports(ast, obj);
      _removeNodes(obj);
      _replaceNodes(obj);
    },
  };
  return obj;
}
