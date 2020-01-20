import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import {
  createASTFromObject,
  createRequireStatement,
  defineVariable,
  isPropertyOrPropertyAccess,
} from '../../Visitor/helpers';
import { isLocalDefined } from '../../helpers/astHelpers';
import { ITransformer } from '../../interfaces/ITransformer';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { ImportType } from '../../interfaces/ImportType';

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

          if (isLocalDefined('process', visit.scope)) {
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
                  avoidReVisit: true,
                  ignoreChildren: true,
                  prependToBody: [statement.statement],
                };
              }
              return;
            }
            const variableAmount = accessList.length;
            if (variableAmount === 3 && accessList[1] === 'env') {
              const keyName = accessList[2];

              if (env && env[keyName] !== undefined) {
                return { replaceWith: { loc: node.loc, type: 'Literal', value: env[keyName].toString() } };
              }
              return { replaceWith: { type: 'Identifier', value: 'undefined' } };
            }
            if (variableAmount === 2) {
              switch (accessList[1]) {
                case 'browser':
                  return { avoidReVisit: true, replaceWith: { loc: node.loc, type: 'Literal', value: true } };
                case 'cwd':
                  return { avoidReVisit: true, replaceWith: { type: 'Literal', value: './' } };
                case 'title':
                  return { avoidReVisit: true, replaceWith: { loc: node.loc, type: 'Literal', value: 'browser' } };
                case 'umask':
                  return { avoidReVisit: true, replaceWith: { type: 'Literal', value: 0 } };
                case 'version':
                  return {
                    avoidReVisit: true,
                    replaceWith: { loc: node.loc, type: 'Literal', value: process.version },
                  };
                case 'versions':
                  return {
                    avoidReVisit: true,
                    replaceWith: { loc: node.loc, properties: [], type: 'ObjectExpression' },
                  };
                case 'env':
                  if (env) {
                    const response: IVisitorMod = {};
                    if (!globalEnvInserted) {
                      response.prependToBody = [defineVariable('___env', createASTFromObject(env))];
                      globalEnvInserted = true;
                    }
                    response.replaceWith = { name: '___env', type: 'Identifier' };
                    return response;
                  } else return { avoidReVisit: true, replaceWith: createASTFromObject({}) };

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
