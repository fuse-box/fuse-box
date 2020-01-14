import { ImportType } from '../../interfaces/ImportType';
import { ITransformer } from '../../interfaces/ITransformer';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import {
  createASTFromObject,
  createRequireStatement,
  defineVariable,
  isPropertyOrPropertyAccess,
} from '../../Visitor/helpers';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';

interface BrowserProcessTransformProps {
  env?: { [key: string]: string };
}
export type IBrowserProcessTransform = BrowserProcessTransformProps & ITransformerSharedOptions;

export function BrowserProcessTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      if (props.ctx.config.target !== 'browser') return;

      const env = props.ctx.config.env;

      let globalEnvInserted = false;
      let entireEnvInserted = false;
      let ignoreProcess = false;

      return {
        onEachNode: (visit: IVisit): IVisitorMod => {
          if (ignoreProcess) return;

          const { node, parent } = visit;
          const locals = visit.scope && visit.scope.locals ? visit.scope.locals : {};

          if (locals['process'] === 1) {
            return;
          }

          const accessList = isPropertyOrPropertyAccess(node, parent, 'process');

          if (accessList) {
            if (visit.parent.type === 'AssignmentExpression') {
              if (!entireEnvInserted) {
                entireEnvInserted = true;
                const statement = createRequireStatement('process', 'process');
                if (props.onRequireCallExpression)
                  props.onRequireCallExpression(ImportType.REQUIRE, statement.reqStatement);
                return {
                  ignoreChildren: true,
                  avoidReVisit: true,
                  prependToBody: [statement.statement],
                };
              }
              return;
            }
            const variableAmount = accessList.length;
            if (variableAmount === 3 && accessList[1] === 'env') {
              const keyName = accessList[2];

              if (env && env[keyName] !== undefined) {
                return { replaceWith: { type: 'Literal', value: env[keyName].toString(), loc: node.loc } };
              }
              return { replaceWith: { type: 'Identifier', value: 'undefined' } };
            }
            if (variableAmount === 2) {
              switch (accessList[1]) {
                case 'version':
                  return {
                    replaceWith: { loc: node.loc, type: 'Literal', value: process.version },
                    avoidReVisit: true,
                  };
                case 'versions':
                  return {
                    replaceWith: { loc: node.loc, type: 'ObjectExpression', properties: [] },
                    avoidReVisit: true,
                  };
                case 'title':
                  return { replaceWith: { loc: node.loc, type: 'Literal', value: 'browser' }, avoidReVisit: true };
                case 'umask':
                  return { replaceWith: { type: 'Literal', value: 0 }, avoidReVisit: true };
                case 'browser':
                  return { replaceWith: { loc: node.loc, type: 'Literal', value: true }, avoidReVisit: true };
                case 'cwd':
                  return { replaceWith: { type: 'Literal', value: './' }, avoidReVisit: true };
                case 'env':
                  if (env) {
                    const response: IVisitorMod = {};
                    if (!globalEnvInserted) {
                      response.prependToBody = [defineVariable('___env', createASTFromObject(env))];
                      globalEnvInserted = true;
                    }
                    response.replaceWith = { type: 'Identifier', name: '___env' };
                    return response;
                  } else return { replaceWith: createASTFromObject({}), avoidReVisit: true };

                default:
                  // inserting require("process")
                  // because we cannot match a know variable
                  if (!entireEnvInserted) {
                    entireEnvInserted = true;

                    const statement = createRequireStatement('process', 'process');

                    if (props.onRequireCallExpression)
                      props.onRequireCallExpression(ImportType.REQUIRE, statement.reqStatement);
                    return {
                      avoidReVisit: true,
                      prependToBody: [statement.statement],
                    };
                  }
                  break;
              }
            }
          }
          return;
        },
      };
    },
  };
}
