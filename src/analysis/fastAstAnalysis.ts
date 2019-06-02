import { ImportType } from '../resolver/resolver';
import { parseAst } from '../transform/fastTransform/fastTransform';
import { fastWalk, nodeIsString } from '../utils/ast';
import { IFastAnalysis } from './fastAnalysis';

export interface IASTAnalysisProps {
  packageName?: string;
  input: string;
  locations?: boolean;
}

const TRACED_VARIABLES = ['__dirname', '__filename', 'stream', 'process', 'buffer', 'Buffer', 'http', 'https'];
const MODULE_VARS = {
  buffer: 'buffer',
};
const MODULE_OBJECTS = {
  buffer: 'Buffer',
};
export function fastAstAnalysis(props: IASTAnalysisProps): IFastAnalysis {
  const ctx: IFastAnalysis = {
    imports: [],
    report: {},
  };

  const ast = parseAst(props.input, { locations: props.locations });
  ctx.ast = ast;
  const bannedVariables = [];
  fastWalk(ast, {
    visit: (node, props) => {
      let { parent, prop, idx } = props;
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
        if (node.arguments[0] && node.arguments[0].type === 'Literal') {
          ctx.report.es6Syntax = true;
          ctx.report.dynamicImports = true;
          ctx.imports.push({ type: ImportType.DYNAMIC, statement: node.arguments[0].value });
        } else {
          throw new Error('Dynamic imports are only supported with static Literals. Please avoid variables to it');
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
      } else if (node.type === 'FunctionDeclaration' && node.id && node.id.type === 'Identifier') {
        if (TRACED_VARIABLES.indexOf(node.id.name) > -1) {
          bannedVariables.push(node.id.name);
          // hoisted function
          // we need to remove all existing browser essentials with the same name;
          if (ctx.report.browserEssentials) {
            const foundIndex = ctx.report.browserEssentials.findIndex(i => i.variable === node.id.name);
            if (foundIndex > -1) {
              ctx.report.browserEssentials.splice(foundIndex, 1);
            }
          }
        }
      } else {
        if (node.type === 'Identifier') {
          const name = node.name;
          if (TRACED_VARIABLES.indexOf(node.name) > -1 && bannedVariables.indexOf(node.name) === -1) {
            if (parent && parent.property === node) {
              return;
            }

            if (name === '__dirname') {
              ctx.report.contains__dirname = true;
            } else if (name === '__filename') {
              ctx.report.contains__filename = true;
            } else {
              if (!ctx.report.browserEssentials) ctx.report.browserEssentials = [];
              if (!ctx.report.browserEssentials.find(i => i.variable === name)) {
                const lowcase = name.toLowerCase();
                ctx.report.browserEssentials.push({
                  obj: MODULE_OBJECTS[lowcase],
                  moduleName: MODULE_VARS[lowcase] ? MODULE_VARS[lowcase] : name,
                  variable: name,
                });
              }
            }
          }
        }
      }
    },
  });

  return ctx;
}
