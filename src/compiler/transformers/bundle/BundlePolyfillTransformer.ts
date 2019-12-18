import * as path from 'path';
import { ASTNode } from '../../interfaces/AST';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { GlobalContext } from '../../program/GlobalContext';
import { createRequireStatement } from '../../Visitor/helpers';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { ImportType } from '../../interfaces/ImportType';
import { ITarget } from '../../../config/PrivateConfig';
import { ITransformer } from '../../interfaces/ITransformer';
import { ensureFuseBoxPath } from '../../../utils/utils';

export interface IBundleEssentialProps {
  target?: ITarget;
  env?: { [key: string]: any };
  isBrowser?: boolean;
  isServer?: boolean;
  moduleFileName?: string;
}

export type IBundleEssntialTransformerOptions = IBundleEssentialProps & ITransformerSharedOptions;

export const PolyfillEssentialConfig = {
  stream: 'stream',
  buffer: 'buffer',
  Buffer: 'buffer',
  http: 'http',
  https: 'https',
};

export function BundlePolyfillTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      const isBrowser = props.ctx.config.target === 'browser';
      if (!isBrowser) return;
      const VariablesInserted = {};
      const RequireStatementsInserted = {};
      const fileName = props.module.props.fuseBoxPath;
      const dirName = ensureFuseBoxPath(path.dirname(props.module.props.fuseBoxPath));

      return {
        onEachNode: (visit: IVisit): IVisitorMod => {
          const { node } = visit;

          if (visit.isLocalIdentifier) {
            const globalContext = visit.globalContext as GlobalContext;
            const locals = visit.scope && visit.scope.locals ? visit.scope.locals : {};
            const name = node.name;

            if (locals[name] || globalContext.hoisted[name]) {
              return;
            }

            switch (name) {
              case '__dirname':
                return { replaceWith: { type: 'Literal', value: fileName } };
              case '__filename':
                return { replaceWith: { type: 'Literal', value: dirName } };
            }

            /**
             * *********************************************************************************
             * Polyfills stream buffer e.t.c
             */
            if (PolyfillEssentialConfig[name]) {
              if (VariablesInserted[name]) return;
              VariablesInserted[name] = 1;
              const statements: Array<ASTNode> = [];
              const moduleName = PolyfillEssentialConfig[name];
              if (!RequireStatementsInserted[moduleName]) {
                RequireStatementsInserted[moduleName] = 1;
                const statement = createRequireStatement(moduleName, name);
                if (props.onRequireCallExpression)
                  props.onRequireCallExpression(ImportType.REQUIRE, statement.reqStatement);
                statements.push(statement.statement);
              }
              if (name !== moduleName) {
                statements.push({
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'Identifier',
                        name: moduleName,
                      },
                      id: {
                        type: 'Identifier',
                        name: name,
                      },
                    },
                  ],
                });
              }
              if (statements.length) {
                return { prependToBody: statements };
              }
            }
          }
          return;
        },
      };
    },
  };
}
