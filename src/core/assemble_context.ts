import { Context } from './__Context';
import { Module } from './Module';
import { Package } from './Package';

export interface IAssembleContext {
  collection: {
    defaultModules: Map<string, Module>;
    resolvedPackages: Map<string, Package>;
  };
}
export function assembleContext(ctx: Context): IAssembleContext {
  return {
    collection: {
      defaultModules: new Map<string, Module>(),
      resolvedPackages: new Map<string, Package>(),
    },
  };
}
