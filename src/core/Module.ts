import { IFastAnalysis } from '../analysis/fastAnalysis';
import { IModuleCacheBasics } from '../cache/cache';
import { createConcat, extractFuseBoxPath, joinFuseBoxPath, readFile } from '../utils/utils';
import { Context } from './Context';
import { Package } from './Package';
const EXECUTABLE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

export interface IModuleProps {
  ctx: Context;
  absPath: string;
  fuseBoxPath: string;
  extension: string;
}
export class Module {
  public isCached: boolean;
  public cache: IModuleCacheBasics;
  public pkg: Package;

  public assembled: boolean;
  public isEntryPoint?: boolean;

  public fastAnalysis: IFastAnalysis;
  public moduleDependencies: Array<Module>;
  public externalDependencies: Array<Package>;

  /*  Properties that affect bundle result  */

  public header: Array<string>; // extra content on top of the file
  public contents: string; // primary contents
  public sourceMap: string; // primary sourcemap

  constructor(public props: IModuleProps, pkg: Package) {
    this.pkg = pkg;
    this.assembled = false;
    this.header = [];
    this.moduleDependencies = [];
    this.externalDependencies = [];
  }

  public isEntry() {
    return this.pkg.entry === this;
  }

  public isTypescriptModule(): boolean {
    return ['.ts', '.tsx'].includes(this.props.extension);
  }

  public setCache(basics: IModuleCacheBasics) {
    this.isCached = true;
    this.cache = basics;
  }

  public getSourceMapPath() {
    const config = this.props.ctx.config;
    if (this.pkg.isDefaultPackage) {
      return joinFuseBoxPath(
        config.options.sourceRoot,
        extractFuseBoxPath(this.props.ctx.config.homeDir, this.props.absPath),
      );
    } else {
      return joinFuseBoxPath(
        '/modules',
        this.pkg.getPublicName(),
        extractFuseBoxPath(this.pkg.props.meta.packageRoot, this.props.absPath),
      );
    }
  }

  public read(): string {
    this.contents = readFile(this.props.absPath);
    return this.contents;
  }

  public isExecutable() {
    return EXECUTABLE_EXTENSIONS.includes(this.props.extension);
  }

  public generate() {
    if (this.header) {
      const concat = createConcat(true, '', '\n');
      this.header.forEach(h => {
        concat.add(null, h);
      });
      concat.add(null, this.contents, this.sourceMap);
      this.contents = concat.content.toString();
      this.sourceMap = concat.sourceMap;
    }
    return {
      contents: this.contents,
      sourceMap: this.sourceMap,
    };
  }
}

export function createModule(props: IModuleProps, pkg: Package) {
  return new Module(props, pkg);
}
