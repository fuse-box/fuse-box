import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { Package } from '../core/Package';
import { ILogger } from '../logging/logging';
import { ProductionModule } from './ProductionModule';
import { ProductionPackage } from './ProductionPackage';
import { Bundle } from '../bundle/Bundle';
import { ESLink } from './structure/ESLink';

export interface IProductionContext {
  packages: Array<Package>;
  ctx: Context;
}

export class ProductionContext {
  private moduleIDCounter: number;
  public productionPackages: Array<ProductionPackage>;

  public dynamicLinks: Array<ESLink>;

  // schema contains all the modules and packages that the application requires
  // it will be missing all the treeshaken module
  public schema: Array<ProductionModule>;

  public bundles: Array<Bundle>;
  private log: ILogger;
  constructor(props: IProductionContext) {
    this.moduleIDCounter = 0;
    this.dynamicLinks = [];
    this.schema = [];
    this.bundles = [];
  }

  public generateUniqueId(): number {
    this.moduleIDCounter++;
    return this.moduleIDCounter;
  }

  public findPackageByName(name: string) {
    return this.productionPackages.find(p => p.pkg.props.meta.name === name);
  }

  public getTsLibModule() {
    const tslib = this.productionPackages.find(p => p.pkg.props.meta.name === 'tslib');
    if (tslib) {
      return tslib.pkg.modules.find(mod => mod.isEntry());
    }
  }

  public getProjectEntries(): Array<Module> {
    for (const pkg of this.productionPackages) {
      if (pkg.pkg.isDefaultPackage) {
        const entries = pkg.pkg.getAllEntries();
        return entries;
      }
    }
    return [];
  }
}
export function createProductionContext(props: IProductionContext): ProductionContext {
  return new ProductionContext(props);
}
