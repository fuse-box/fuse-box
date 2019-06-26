import { SourceFile } from 'ts-morph';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { Concat } from '../utils/utils';
import { ProductionContext } from './ProductionContext';
import { ProductionPackage } from './ProductionPackage';
import { ESLink } from './structure/ESLink';
import { ESModuleStructure } from './structure/ESModuleStructure';

export class ProductionModule {
  public file: SourceFile;
  public ctx: Context;
  public structure: ESModuleStructure;
  public dependants: Array<ESLink>;

  public transpiledSourceMap: string;
  public transpiledContent: string;
  public productionContent: Concat;

  private id: number;

  constructor(public context: ProductionContext, public module: Module, public productionPackage: ProductionPackage) {
    this.ctx = module.props.ctx;
    this.dependants = [];
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
        if (!info.link) continue;
        if (info.link.module) {
          return info.link.module.productionModule;
        }
        if (info.link.package && info.link.resolver) {
          const packageTargetAbsPath = info.link.resolver.package.targetAbsPath;
          const targetProductionPackage = info.link.package.productionPackage;

          const targetModule = targetProductionPackage.pkg.modules.find(
            mod => mod.props.absPath === packageTargetAbsPath,
          );
          return targetModule.productionModule;
        }
      }
    }
  }

  public getSourceText() {
    return this.file.getText();
  }

  public treeShake() { }
}
