import { ASTNode } from '../interfaces/AST';
import { IProgramProps } from './transpileModule';

export interface GlobalContext {
  getNextIndex: () => number;
  exportAfterDeclaration?: {
    [key: string]: {
      target?: string;
    };
  };
  programProps?: IProgramProps;
  identifierReplacement: {
    [key: string]: {
      first?: string;
      second?: string;
      insertAfter?: ASTNode;
      inUse?: boolean;
    };
  };
  namespace?: string;
  completeCallbacks?: Array<() => void>;
}

export function createGlobalContext(userContext?: { [key: string]: any }): GlobalContext {
  let index = 1;
  let essentialContext = {
    completeCallbacks: [],
    getNextIndex: () => index++,
    identifierReplacement: {},
    namespace: 'exports',
  };
  if (userContext) {
    for (const key in userContext) {
      essentialContext[key] = userContext[key];
    }
  }

  return essentialContext;
}
