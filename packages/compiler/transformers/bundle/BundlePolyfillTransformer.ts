import * as path from 'path';
import { ASTNode } from '../../interfaces/AST';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { GlobalContext } from '../../program/GlobalContext';
import { createRequireStatement } from '../../Visitor/helpers';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { ImportType } from '../../interfaces/ImportType';

export interface IBundleEssentialProps {
  target?: 'browser' | 'server' | 'electron';
  env?: { [key: string]: any };
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

export function BundlePolyfillTransformer(options: IBundleEssntialTransformerOptions) {
  const RequireStatementsInserted = {};
  const VariablesInserted = {};
  options = options || {};
  return (visit: IVisit): IVisitorMod => {
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
          return { replaceWith: { type: 'Literal', value: options.moduleFileName } };
        case '__filename':
          return { replaceWith: { type: 'Literal', value: path.dirname(options.moduleFileName) } };
      }

      if (options.target !== 'browser') return;

      /**
       * *********************************************************************************
       * Polyfills stream buffer e.t.c
       */
      if (PolyfillEssentialConfig[name]) {
        if (VariablesInserted[name]) return;
        const statements: Array<ASTNode> = [];
        const moduleName = PolyfillEssentialConfig[name];
        if (!RequireStatementsInserted[moduleName]) {
          RequireStatementsInserted[moduleName] = 1;
          const statement = createRequireStatement(moduleName, name);
          if (options.onRequireCallExpression)
            options.onRequireCallExpression(ImportType.REQUIRE, statement.reqStatement);
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
  };
}
