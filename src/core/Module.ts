import { Context } from './Context';
import { Package } from './Package';
import { readFile } from '../utils/utils';
import { IFastAnalysis } from '../analysis/fastAnalysis';

const EXECUTABLE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

export interface IModuleProps {
  ctx: Context;
  absPath: string;
  fuseBoxPath: string;
  extension: string;
}
export class Module {
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

  public read(): string {
    this.contents = readFile(this.props.absPath);
    return this.contents;
  }

  public isExecutable() {
    return EXECUTABLE_EXTENSIONS.includes(this.props.extension);
  }
}

export function createModule(props: IModuleProps, pkg: Package) {
  return new Module(props, pkg);
}
