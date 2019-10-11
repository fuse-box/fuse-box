import { SourceFile } from 'ts-morph';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { Concat } from '../utils/utils';
import { ProductionContext } from './ProductionContext';
import { ProductionPackage } from './ProductionPackage';
import { ESLink } from './structure/ESLink';
import { ESModuleStructure } from './structure/ESModuleStructure';
import { Bundle } from '../bundle/Bundle';

export class ProductionModule {
  public file: SourceFile;
  public ctx: Context;
  public structure: ESModuleStructure;
  public dependants: Array<ESLink>;

  // can belong to a split bundle
  public splitBundle: Bundle;

  // if this is an etry points
  // it would containwe depednencies
  public dynamicDependencies: Array<ProductionModule>;

  public transpiledSourceMap: string;
  public transpiledContent: string;
  public productionContent: Concat;

  private id: number;

  constructor(public context: ProductionContext, public module: Module, public productionPackage: ProductionPackage) {
    this.ctx = module.props.ctx;
    this.dependants = [];
    this.dynamicDependencies = [];
  }

  public getId() {
    if (this.id === undefined) {
      this.id = this.context.generateUniqueId();
    }
    return this.id;
  }

  public findDependantModule(name: string): ProductionModule {
    // a special treatment for tslib
    if (name === 'tslib') {
      const tslib = this.context.getTsLibModule();
      return tslib.productionModule;
    }
    for (const info of this.module.fastAnalysis.imports) {
      if (name === info.statement) {
        if (!info.link) return;
        if (info.link.module) {
          return info.link.module.productionModule;
        }
        if (info.link.package && info.link.resolver) {
          const packageTargetAbsPath = info.link.resolver.package.targetAbsPath;
          const targetProductionPackage = info.link.package.productionPackage;

          const targetModule = targetProductionPackage.pkg.modules.find(
            mod => mod.props.absPath === packageTargetAbsPath,
          );
          if (targetModule) {
            return targetModule.productionModule;
          } else {
            const entries = info.link.package.getAllEntries();
            // a very rare edge case where the same version of the same package resides in difference folders
            if (entries.length) {
              const targetModule = targetProductionPackage.pkg.modules.find(item => {
                return (item.props.fuseBoxPath = info.link.resolver.package.targetFuseBoxPath);
              });
              if (targetModule) return targetModule.productionModule;
            }
          }
        }
      }
    }
  }

  public getShortPath() {
    return this.module.getShortPath();
  }

  public getSourceText() {
    return this.file.getText();
  }

  public treeShake() {}
}
