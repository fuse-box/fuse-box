import { IFastAnalysis } from '../analysis/fastAnalysis';
import { IModuleCacheBasics } from '../cache/cache';
import { createConcat, extractFuseBoxPath, joinFuseBoxPath, readFile, ensureFuseBoxPath } from '../utils/utils';
import { Context } from './Context';
import { Package } from './Package';
import { testPath } from '../plugins/pluginUtils';
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

  public assembled: boolean;
  public isEntryPoint?: boolean;

  public fastAnalysis: IFastAnalysis;

  /**
   * A package that holds this module
   *
   * @type {Package}
   * @memberof Module
   */

  public pkg: Package;
  /**
   * A list of modules that imported this moudle
   *
   * @type {Array<Module>}
   * @memberof Module
   */
  public moduleDependants: Array<Module>;

  /**
   * Toggle this from plugins in order to let the watchers to break
   * all modules cache which imported this module
   *
   * @type {boolean}
   * @memberof Module
   */
  public breakDependantsCache: boolean;

  /**
   * Current dependency tree
   *
   * @type {Array<Module>}
   * @memberof Module
   */
  public moduleDependencies: Array<Module>;

  /**
   * Node Modules dependencies of this module
   *
   * @type {Array<Package>}
   * @memberof Module
   */
  public externalDependencies: Array<Package>;

  /**
   * Used by plugins to identify whether this module has been captured
   * And prevent other plugins from capturing it
   *
   * @type {boolean}
   * @memberof Module
   */
  public captured: boolean;

  /*  Properties that affect bundle result  */

  public header: Array<string>; // extra content on top of the file
  public contents: string; // primary contents
  public sourceMap: string; // primary sourcemap
  public cssSourceMap: string; // css sourcemap
  public weakReferences: Array<string>;
  public ast?: any;

  private _isStylesheet: boolean;
  private _isExecutable: boolean;

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

  public addWeakReference(url: string) {
    if (url === this.props.absPath) return;
    if (!this.weakReferences) this.weakReferences = [];
    if (!this.weakReferences.includes(url)) {
      this.weakReferences.push(url);
      this.props.ctx.weakReferences.add(url, this.props.absPath);
    }
  }

  public testPath(path: string | RegExp) {
    return testPath(this.props.absPath, path);
  }

  public setCache(basics: IModuleCacheBasics) {
    this.isCached = true;
    this.cache = basics;
  }

  public getSourceMapPath() {
    const config = this.props.ctx.config;
    if (this.pkg.isDefaultPackage) {
      return joinFuseBoxPath(
        config.sourceMap.sourceRoot,
        extractFuseBoxPath(this.props.ctx.config.homeDir, this.props.absPath),
      );
    } else {
      return joinFuseBoxPath(
        config.defaultSourceMapModulesRoot,
        this.pkg.getPublicName(),
        extractFuseBoxPath(this.pkg.props.meta.packageRoot, this.props.absPath),
      );
    }
  }

  public read(): string {
    if (!this.contents) {
      this.contents = readFile(this.props.absPath);
    }
    return this.contents;
  }

  public isExecutable() {
    if (this._isExecutable === undefined) {
      this._isExecutable = EXECUTABLE_EXTENSIONS.includes(this.props.extension);
    }
    return this._isExecutable;
  }

  public isStylesheet() {
    if (this._isStylesheet === undefined) {
      this._isStylesheet = ['.css', '.scss', '.sass', '.less', '.styl'].indexOf(this.props.extension) > -1;
    }
    return this._isStylesheet;
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
