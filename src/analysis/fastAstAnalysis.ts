import { ImportType } from '../resolver/resolver';
import { parseAst } from '../transform/fastTransform';
import { fastWalk, nodeIsString } from '../utils/ast';
import { IFastAnalysis } from './fastAnalysis';

export interface IASTAnalysisProps {
  input: string;
  locations?: boolean;
}

const TRACED_VARIABLES = ['__dirname', '__filename', 'stream', 'process', 'buffer', 'Buffer', 'http', 'https'];
const MODULE_VARS = {
  Buffer: 'buffer',
};
export function fastAstAnalysis(props: IASTAnalysisProps): IFastAnalysis {
  const ctx: IFastAnalysis = {
    imports: [],
    report: {},
  };

  const ast = parseAst(props.input, { locations: props.locations });
  ctx.ast = ast;
  const bannedVariables = [];
  fastWalk(ast, (node, parent, prop, idx) => {
    if (
      node.type === 'ImportDeclaration' ||
      node.type === 'ExportNamedDeclaration' ||
      node.type === 'ExportAllDeclaration'
    ) {
      ctx.report.es6Syntax = true;
      if (node.source) {
        ctx.imports.push({ type: ImportType.RAW_IMPORT, statement: node.source.value });
      }
    } else if (node.callee && node.callee.type === 'Import' && node.type === 'CallExpression') {
      if (node.arguments && node.arguments[0] && node.arguments[0].type === 'Literal') {
        ctx.report.es6Syntax = true;
        ctx.report.dynamicImports = true;
        ctx.imports.push({ type: ImportType.DYNAMIC, statement: node.arguments[0].value });
      }
    } else if (node.type === 'ExportDefaultDeclaration') {
      ctx.report.es6Syntax = true;
    } else if (node.type === 'CallExpression' && node.callee) {
      if (node.callee.type === 'Identifier' && node.callee.name === 'require') {
        let arg1 = node.arguments[0];
        if (node.arguments.length === 1 && nodeIsString(arg1)) {
          ctx.imports.push({ type: ImportType.REQUIRE, statement: arg1.value });
        }
      }
    } else if (node.type === 'VariableDeclarator' && node.id && node.id.type === 'Identifier') {
      if (TRACED_VARIABLES.indexOf(node.id.name) > -1) {
        bannedVariables.push(node.id.name);
      }
    } else {
      if (node.type === 'Identifier') {
        if (parent && parent.type === 'MemberExpression') {
          return;
        }
        const name = node.name;
        if (TRACED_VARIABLES.indexOf(node.name) > -1 && bannedVariables.indexOf(node.name) === -1) {
          if (name === '__dirname') {
            ctx.report.contains__dirname = true;
          } else if (name === '__filename') {
            ctx.report.contains__filename = true;
          } else {
            if (!ctx.report.browserEssentials) ctx.report.browserEssentials = [];
            if (!ctx.report.browserEssentials.find(i => i.variable === name)) {
              ctx.report.browserEssentials.push({
                moduleName: MODULE_VARS[name] ? MODULE_VARS[name] : name,
                variable: name,
              });
            }
          }
        }
      }
    }
  });

  return ctx;
}
