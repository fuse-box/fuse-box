import * as path from 'path';
import { ensureFuseBoxPath } from '../../../utils/utils';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { createRequireStatement } from '../../Visitor/helpers';
import { isLocalDefined } from '../../helpers/astHelpers';
import { ASTNode } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { ImportType } from '../../interfaces/ImportType';

export type IBundleEssntialTransformerOptions = ITransformerSharedOptions;

export const PolyfillEssentialConfig = {
  Buffer: 'buffer',
  buffer: 'buffer',
  http: 'http',
  https: 'https',
  process: 'process',
  stream: 'stream',
};

export function BundlePolyfillTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      const {
        transformationContext: {
          compilerOptions,
          module: { publicPath },
        },
      } = props;

      const isBrowser = compilerOptions.buildTarget === 'browser';
      const isWebWorker = compilerOptions.buildTarget === 'web-worker';
      if (!(isBrowser || isWebWorker)) return;

      const VariablesInserted = {};
      const RequireStatementsInserted = {};

      const dirName = ensureFuseBoxPath(path.dirname(publicPath));

      return {
        onEachNode: (visit: IVisit): IVisitorMod => {
          const { node } = visit;

          if (visit.isLocalIdentifier) {
            const name = node.name;

            if (isLocalDefined(name, visit.scope)) {
              return;
            }

            switch (name) {
              case '__dirname':
                return { replaceWith: { type: 'Literal', value: publicPath } };
              case '__filename':
                return { replaceWith: { type: 'Literal', value: dirName } };
              case 'global':
                return { replaceWith: { name: isWebWorker ? 'self' : 'window', type: 'Identifier' } };
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
                const statement = createRequireStatement(moduleName, moduleName);
                if (props.onRequireCallExpression)
                  props.onRequireCallExpression(ImportType.REQUIRE, statement.reqStatement);
                statements.push(statement.statement);
              }
              if (name !== moduleName) {
                statements.push({
                  declarations: [
                    {
                      id: {
                        name: name,
                        type: 'Identifier',
                      },
                      init: {
                        name: moduleName,
                        type: 'Identifier',
                      },
                      type: 'VariableDeclarator',
                    },
                  ],
                  kind: 'var',
                  type: 'VariableDeclaration',
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
