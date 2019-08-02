import { generate } from 'astring';
import * as meriyah from 'meriyah';

import * as sourceMapModule from 'source-map';
import { fastWalk } from '../../utils/ast';
import {
  createExportsExpression,
  createModuleExportsAssign,
  isLocalIdentifier,
  isRequireStatement,
  isWorkerStatement,
  isShortHandIdentifier,
} from '../transformUtils';
import { handleExportDefaultDeclaration } from './exportDefaultDeclaration';
import { onImportDeclaration } from './importDeclaration';
import { exportNamedDeclaration } from './namedDeclaration';
import { createTransformContext } from './TrasnformContext';
import { IWebWorkerItem } from '../../analysis/fastAnalysis';

export function parseAst(contents: string, options?: { loc: boolean }) {
  let opts = { next: false, module: true, ...(options || {}) };

  return meriyah.parse(contents, opts);
}

export interface IFastTransformProps {
  sourceMaps?: boolean;
  input: string;
  absPath?: string;
  ast?: any;
  webWorkers?: Array<IWebWorkerItem>;
  sourceInterceptor?: (source: string) => string;
}
export function fastTransform(opts: IFastTransformProps): { code: string; sourceMap: any } {
  const ast = opts.ast ? opts.ast : parseAst(opts.input, { loc: opts.sourceMaps });

  const ctx = createTransformContext(opts);

  fastWalk(ast, {
    withScope: true,
    visit: (node, props, context) => {
      let { parent, prop, idx } = props;
      switch (node.type) {
        case 'ExportAllDeclaration':
          const { type, expression } = createModuleExportsAssign(node.source.value);
          node.type = type;
          node.expression = expression;
          delete node.source;
          break;
        case 'ExportDefaultDeclaration':
          handleExportDefaultDeclaration(ctx, node, parent, prop, idx, context);
          break;
        case 'ExportNamedDeclaration':
          exportNamedDeclaration(ctx, node, parent, prop, idx, context);
          break;
        case 'ImportDeclaration':
          onImportDeclaration(ctx, node, parent, prop, idx);
          break;
        default:
          const reqStatement = isRequireStatement(node, parent);
          if (reqStatement) {
            node.arguments[0].value = ctx.interceptSource(node.arguments[0].value);
          }
          if (opts.webWorkers) {
            const webWorkerStatement = isWorkerStatement(node);
            if (webWorkerStatement) {
              const item = opts.webWorkers.find(
                item => item.path === webWorkerStatement.value && item.type === webWorkerStatement.type,
              );
              if (item) {
                node.arguments[0].value = item.bundlePath;
              }
            }
          }

          const shortHand = isShortHandIdentifier(node, parent);
          if (shortHand) {
            if (ctx.tracedImportSpecifiers[shortHand.node.name]) {
              // if it belongs to a function "someFunc(foo){}"
              if (ctx.tracedImportSpecifiers[shortHand.node.name].nodes) {
                if (context && context.locals.indexOf(shortHand.node.name) > -1) {
                  return;
                }
                shortHand.parent.shorthand = false;
                ctx.tracedImportSpecifiers[shortHand.node.name].nodes.push({
                  node: shortHand.node,
                  parent: shortHand.parent,
                  prop: 'value',
                });
              }
              return;
            }
          }

          if (isLocalIdentifier(node, parent)) {
            if (ctx.tracedImportSpecifiers[node.name]) {
              // if it belongs to a function "someFunc(foo){}"
              if (ctx.tracedImportSpecifiers[node.name].nodes) {
                if (context && context.locals.indexOf(node.name) > -1) {
                  return;
                }
                ctx.tracedImportSpecifiers[node.name].nodes.push({ node, parent, prop, idx });
              }
            } else {
              if (parent.type !== 'VariableDeclarator' && ctx.undefinedExports.indexOf(node.name) > -1) {
                if (context && context.locals.indexOf(node.name) > -1) {
                  break;
                }
                if (parent && prop) {
                  ctx.toReplace(parent, prop, idx, createExportsExpression(node.name));
                  return;
                }
              }
            }
          }
          break;
      }
    },
  });

  ctx.postWork(ast);
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
