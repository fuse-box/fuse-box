import { Context } from '../core/Context';
import { Package } from '../core/Package';
import { Concat, createConcat } from '../utils/utils';

export interface IBundleProps {
  ctx: Context;
  name: string;
  priority?: number;
}
export class Bundle {
  public packages: Array<Package>;

  public contents: Concat;
  constructor(public props: IBundleProps) {
    this.packages = [];
    this.contents = createConcat(true, this.props.name, '\n');
  }

  public addContent(contents: string, sm?) {
    this.contents.add(null, contents, sm);
  }

  public addPackage(pkg: Package) {
    this.packages.push(pkg);
  }

  public generate() {
    return {
      contents: this.contents.content.toString(),
      sourceMap: this.contents.sourceMap,
    };
  }
}

export function createBundle(props: IBundleProps) {
  return new Bundle(props);
}
