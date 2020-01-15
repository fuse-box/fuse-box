import * as path from 'path';
import { ITarget } from '../../../config/PrivateConfig';
import { ensureFuseBoxPath } from '../../../utils/utils';
import { ASTNode } from '../../interfaces/AST';
import { ImportType } from '../../interfaces/ImportType';
import { ITransformer } from '../../interfaces/ITransformer';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { createRequireStatement } from '../../Visitor/helpers';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { isLocalDefined } from '../astHelpers';

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
  process: 'process',
};

export function BundlePolyfillTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      const isBrowser = props.ctx.config.target === 'browser';
      const isWebWorker = props.ctx.config.target === 'web-worker';
      if (!(isBrowser || isWebWorker)) return;

      const VariablesInserted = {};
      const RequireStatementsInserted = {};
      const fileName = props.module.props.fuseBoxPath;
      const dirName = ensureFuseBoxPath(path.dirname(props.module.props.fuseBoxPath));

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
                return { replaceWith: { type: 'Literal', value: fileName } };
              case '__filename':
                return { replaceWith: { type: 'Literal', value: dirName } };
              case 'global':
                return { replaceWith: { type: 'Identifier', name: isWebWorker ? 'self' : 'window' } };
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
