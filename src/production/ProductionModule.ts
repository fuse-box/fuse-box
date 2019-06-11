import { Project, SourceFile } from 'ts-morph';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { ProductionPackage } from './ProductionPackage';
import { performStaticTransformations } from './transformation';
import { ProductionContext } from './ProductionContext';
import { ESModuleStructure, createESModuleStructure } from './structure/ESModuleStructure';
import { ESLink } from './structure/ESLink';

export class ProductionModule {
  private file: SourceFile;
  private ctx: Context;
  public structure: ESModuleStructure;
  public dependants: Array<ESLink>;

  constructor(public context: ProductionContext, public module: Module, public productionPackage: ProductionPackage) {
    this.ctx = module.props.ctx;
    this.module.productionModule = this;
    this.dependants = [];
    this.staticTransform();
  }
  private staticTransform() {
    if (this.module.isExecutable()) {
      this.ctx.log.progress('<cyan><bold>  Static transform:</bold></cyan><dim> $file</dim>', {
        file: this.module.props.absPath,
      });

      const project = new Project();
      this.file = project.createSourceFile('src/foo.ts', this.module.contents);
      performStaticTransformations({
        ctx: this.module.props.ctx,
        file: this.file,
        fuseBoxPath: this.module.props.fuseBoxPath,
      });
    }
  }

  public getSourceText() {
    return this.file.getText();
  }

  public treeShake() {}

  public referenceLink() {
    const structure = this.structure;

    //    console.log(JSON.stringify(structure.toJSON(), null, 2));
    this.dependants.forEach(externalLink => {
      let debug = this.module.getShortPath() === 'foo/index.js';

      // checking imports
      // import { foo } from "./homeModule";
      for (const importedExternal of externalLink.imports) {
        for (const homeLink of structure.links) {
          const target = homeLink.exports.find(exp => {
            return importedExternal.name === (exp.exported || exp.name);
          });
          if (target) {
            target.dependantVariables.push(importedExternal);

            this.ctx.log.progress(
              '<bold><dim> <yellow>$ref</yellow> [ $objType ]  <green>$fromModule</green> to <magenta>$from</magenta></dim></bold>',
              {
                fromModule: this.module.getShortPath(),
                from: importedExternal.link.productionModule.module.getShortPath(),
                ref: target.exported,
                objType: target.type,
              },
            );
          } else {
            //console.log('not found', homeLink.toJSON());
          }
        }
      }

      // checking imports
      // export { foo } from "./homeModule";
      for (const exportedExternal of externalLink.exports) {
        for (const homeLink of structure.links) {
          const target = homeLink.exports.find(exp => {
            return exportedExternal.name === exp.exported;
          });
          if (target) {
            target.dependantExports.push(exportedExternal);
            this.ctx.log.progress(
              '<bold><dim> <yellow>$ref</yellow> [ $objType ]  <green>$fromModule</green> to <magenta>$from</magenta></dim></bold>',
              {
                fromModule: this.module.getShortPath(),
                from: exportedExternal.link.productionModule.module.getShortPath(),
                ref: target.exported,
                objType: target.type,
              },
            );
          }
        }
      }
    });
  }

  public link() {
    this.structure = createESModuleStructure(this, this.file);

    const fromLinks = this.structure.findFromLinks();
    const imports = this.module.fastAnalysis.imports;
    fromLinks.forEach(link => {
      const info = imports.find(imp => imp.statement === link.fromSource);
      if (!info) return;
      if (info.link.package && info.link.resolver) {
        const packageTargetAbsPath = info.link.resolver.package.targetAbsPath;
        const targetProductionPackage = info.link.package.productionPackage;

        const targetModule = targetProductionPackage.pkg.modules.find(
          mod => mod.props.absPath === packageTargetAbsPath,
        );
        if (targetModule && targetModule.isExecutable()) {
          this.ctx.log.progress(
            '<bold><dim>   link <yellow>$fromSource</yellow> from <magenta>$origin</magenta> to <green>$target</green></dim></bold>',
            {
              fromSource: link.fromSource,
              origin: this.module.getShortPath(),
              target: targetModule.getShortPath(),
            },
          );

          const targetProductionModule = targetModule.productionModule;
          // linking reference
          link.productionModule = this;
          targetProductionModule.dependants.push(link);
        }
      }

      if (info.link.module) {
        const productionModule = info.link.module.productionModule;
        if (productionModule.module.isExecutable()) {
          this.ctx.log.progress(
            '<bold><dim>   link module <yellow>$fromSource</yellow> from <magenta>$from</magenta> to <green>$to</green></dim></bold>',
            {
              fromSource: link.fromSource,
              from: this.module.getShortPath(),
              to: productionModule.module.getShortPath(),
            },
          );

          link.productionModule = this;
          productionModule.dependants.push(link);
        }
      }
    });
  }
}
