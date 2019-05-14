import { generate } from 'astring';
//import * as meriyah from 'meriyah';
import * as sourceMapModule from 'source-map';
import { walkAST } from '../utils/ast';
import * as cherow from 'cherow';
import {
  createLocalVariable,
  createMemberExpression,
  createModuleExports,
  createModuleExportsAssign,
  createRequireStatement,
  isExportDefaultDeclaration,
  isExportNamedDeclaration,
} from './acornUtils';

const meriyah = require('./meriyah.js');

export function parseAst(contents: string, options?: any) {
  return meriyah.parse(contents, {
    next: false,
    globalAwait: true,
    webCompat: true,
    module: true,
  });

  // return cherow.parseModule(contents, {
  //   next: true,
  //   globalAwait: true,
  //   webCompat: true,
  //   module: true,
  // });
}

interface Ctx {
  interceptSource: (string) => string;
  imported?: Array<{ local: any; exported: any }>;
  exported: Array<{ local: any; exported: any }>;
  reqStatements: Array<{
    replaceNode?: { array: Array<any>; node: any };
    local: string;
    source: string;
    localVariables?: Array<{ local: any; exported: any }>;
  }>;
  generateName: () => string;
  toRemove: (arr: any, node: any) => void;
}

function handleExportSpecifiers(ctx: Ctx, node, parent, prop, idx) {
  if (node.source) {
    const name = ctx.generateName();
    if (node.source.type === 'Literal') {
      ctx.reqStatements.push({ local: name, source: node.source.value });
    }
    node.specifiers.forEach(specifier => {
      ctx.exported.push({
        exported: specifier.exported.name,
        local: createMemberExpression(name, specifier.local.name),
      });
    });
  } else {
    // export { name1, name2}
    node.specifiers.forEach(specifier => {
      ctx.exported.push({ local: specifier.local.name, exported: specifier.exported.name });
    });
  }
  if (prop && idx !== undefined) {
    ctx.toRemove(parent[prop], node);
  }
}

function exportNamedDeclaration(ctx: Ctx, node, parent, prop, idx) {
  if (node.declaration) {
    const type = node.declaration.type;
    // export const foobar = 1, foo = 3, some = class {}

    if (type === 'VariableDeclaration') {
      const declarations = node.declaration.declarations;
      declarations.map(declaration => {
        if (declaration.id && declaration.id.name) {
          ctx.exported.push({ local: declaration.id.name, exported: declaration.id.name });
        }
      });
      node.type = 'VariableDeclaration';
      node.declarations = node.declaration.declarations;
      node.kind = node.declaration.kind;
      return false;
    }

    // export function/class
    if (type === 'FunctionDeclaration' || type === 'ClassDeclaration') {
      if (node.declaration.id) {
        const name = node.declaration.id.name;
        if (prop && idx !== undefined) {
          if (Array.isArray(parent[prop])) {
            parent[prop][idx] = node.declaration; //1

            ctx.exported.push({
              exported: name,
              local: name,
            });
          }
        }
      }
      return false;
    }
  }
  if (node.specifiers && node.specifiers.length) {
    handleExportSpecifiers(ctx, node, parent, prop, idx);
  }
}

function onImportDeclaration(ctx: Ctx, node, parent, prop, idx) {
  const source = node.source.value;
  const localName = ctx.generateName();
  const localVariables: Array<{ local: any; exported: any }> = [];

  const opts: any = {
    replaceNode: { array: parent[prop], node },
    source: source,
    localVariables,
  };

  if (node.specifiers.length > 0) {
    opts.local = localName;
  }
  ctx.reqStatements.push(opts);
  node.specifiers.forEach(specifier => {
    if (specifier.type === 'ImportSpecifier') {
      //ctx.imported.push({lo})
      localVariables.push({
        exported: specifier.local.name,
        local: createMemberExpression(localName, specifier.imported.name),
      });
    } else if (specifier.type === 'ImportDefaultSpecifier') {
      localVariables.push({
        exported: specifier.local.name,
        local: createMemberExpression(localName, 'default'),
      });
    } else if (specifier.type === 'ImportNamespaceSpecifier') {
      localVariables.push({
        exported: specifier.local.name,
        local: {
          type: 'Identifier',
          name: localName,
        },
      });
    }
  });
  //ctx.toRemove(parent[prop], node);
}
export function fastTransform(opts: {
  sourceMaps?: boolean;
  input: string;
  absPath?: string;
  ast?: any;
  sourceInterceptor?: (source: string) => string;
}): { code: string; sourceMap: any } {
  const ast = opts.ast ? opts.ast : parseAst(opts.input, { locations: opts.sourceMaps });
  let nameIndex = 0;
  const toBeRemoved: Array<{ arr: any; node: any }> = [];
  const ctx: Ctx = {
    exported: [],
    reqStatements: [],
    interceptSource: source => {
      if (!opts.sourceInterceptor) {
        return source;
      }
      return opts.sourceInterceptor(source);
    },
    toRemove: (arr, node) => {
      toBeRemoved.push({ arr, node });
    },
    generateName: () => {
      nameIndex++;
      return `__req${nameIndex}__`;
    },
  };
  //console.log(JSON.stringify(ast, null, 2));
  //console.log(JSON.stringify(ast.body, null, 2));
  walkAST(ast, {
    onNode: (node, parent, prop, idx) => {
      if (node.type === 'ExportAllDeclaration') {
        const { type, expression } = createModuleExportsAssign(node.source.value);
        node.type = type;
        node.expression = expression;
        delete node.source;
      }
      if (isExportDefaultDeclaration(node)) {
        if (prop && idx !== undefined) {
          if (Array.isArray(parent[prop])) {
            if (node.declaration && node.declaration.id && node.declaration.id.name) {
              const name = node.declaration.id.name;
              parent[prop][idx] = node.declaration; //2
              ctx.exported.push({
                exported: 'default',
                local: name,
              });
            } else {
              parent[prop][idx] = createModuleExports('default', node.declaration);
            }
          }
        }
      }
      if (isExportNamedDeclaration(node)) {
        if (exportNamedDeclaration(ctx, node, parent, prop, idx) === false) {
          return false;
        }
      }
      if (node.type === 'ImportDeclaration') {
        onImportDeclaration(ctx, node, parent, prop, idx);
      }
    },
  });
  ctx.reqStatements.forEach(item => {
    if (item.replaceNode) {
      const tree = item.replaceNode.array;
      const index = tree.indexOf(item.replaceNode.node);
      if (index > -1) {
        tree[index] = createRequireStatement(item.local, ctx.interceptSource(item.source));
        if (item.localVariables) {
          const args: any = [index + 1, 0];
          item.localVariables.forEach(variable => {
            args.push(createLocalVariable(variable.exported, variable.local));
          });
          tree.splice.apply(tree, args);
        }
      }
    } else {
      ast.body.unshift(createRequireStatement(item.local, ctx.interceptSource(item.source)));
    }
  });

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

  toBeRemoved.forEach(item => {
    const index = item.arr.indexOf(item.node);
    if (index > -1) {
      item.arr.splice(index, 1);
    }
  });

  let map;
  if (opts.sourceMaps) {
    map = new sourceMapModule.SourceMapGenerator({
      file: 'script.js',
    });
  }
  const code = generate(ast, { ecmaVersion: 7, sourceMap: map });
  let jsonSourceMaps;

  if (opts.sourceMaps) {
    jsonSourceMaps = map.toJSON();
    if (!jsonSourceMaps.sourcesContent) {
      delete jsonSourceMaps.file;
      jsonSourceMaps.sourcesContent = [opts.input];
    }
  }

  return { code, sourceMap: jsonSourceMaps };
}
