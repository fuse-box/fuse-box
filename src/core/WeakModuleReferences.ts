import { Context } from './context';

/**
 * This module is used to store "weak" references for non-js modules
 * For example a scss file can have multiple import, none of those imports actually belong to the project
 * hence won't be matched by the wather. In order to solve this sutation we map those references to corresponding modules
 */
export class WeakModuleReferences {
  public collection: { [key: string]: Array<string> };
  constructor(public ctx: Context) {
    this.collection = {};
  }

  public add(absPath: string, filePath: string) {
    if (!this.collection[absPath]) {
      this.collection[absPath] = [];
    }
    if (this.collection[absPath].indexOf(filePath) === -1) {
      this.collection[absPath].push(filePath);
    }
  }

  public flush() {
    this.collection = {};
  }

  public find(absPath: string): Array<string> {
    return this.collection[absPath];
  }
}

export function createWeakModuleReferences(ctx: Context) {
  return new WeakModuleReferences(ctx);
}
