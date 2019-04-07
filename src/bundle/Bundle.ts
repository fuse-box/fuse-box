import * as path from 'path';
import { Context } from '../core/Context';
import { Package } from '../core/Package';
import { IWriterResponse, IWriter, IWriterActions } from '../core/writer';
import { Concat, createConcat } from '../utils/utils';
import { IConfig } from '../core/interfaces';
import { sourceMapsURL } from './bundleStrings';

/**
 * Bundle types with priorities
 * The numbers should not be changed
 */
export enum BundleType {
  CSS = 1,
  DEV = 2,
  VENDOR_JS = 3,
  PROJECT_JS = 4,
}

/**
 * Mapped bundle names
 * Those could be changed it's mainly used for development
 */
export const BundleNames = {
  [BundleType.CSS]: 'styles',
  [BundleType.DEV]: 'dev',
  [BundleType.PROJECT_JS]: 'app',
  [BundleType.VENDOR_JS]: 'vendor',
};

export interface IBundleProps {
  ctx: Context;
  name: string;
  priority?: number;
  webIndexed?: boolean;
  type: BundleType;
}

export interface IBundleWriteResponse {
  bundle: Bundle;
  stat: IWriterResponse;
}

export type BundleCollection = { [key: string]: Bundle };

/**
 * If a bundle doesn't exist in the collection it creates a new one
 * @param collection
 * @param ctx
 * @param type
 */
export function getBundleByType(collection: BundleCollection, ctx: Context, type: BundleType, webIndexed?: boolean) {
  const bundleName = BundleNames[type];
  collection[bundleName] = collection[bundleName]
    ? collection[bundleName]
    : createBundle({ ctx: ctx, name: bundleName, type: type, priority: type, webIndexed: webIndexed });
  return collection[bundleName];
}

/**
 * Creates a bundle set for convenience of creationing new bundes by type
 * @param ctx
 */
export function createBundleSet(ctx: Context) {
  const collection: BundleCollection = {};
  return {
    collection: collection,
    getBundle: (type: BundleType) => {
      return getBundleByType(collection, ctx, type, true);
    },
  };
}
/**
 * Checks if this bundle type requires sourcemaps to be written
 * @param type
 * @param config
 */
function shouldAddSourcemaps(type: BundleType, config: IConfig): boolean {
  const opts = config.options;
  const shouldWrite =
    (opts.cssSourceMap && type == BundleType.CSS) ||
    (opts.projectSourceMap && type === BundleType.PROJECT_JS) ||
    (opts.vendorSourceMap && BundleType.VENDOR_JS);
  return !!shouldWrite;
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

  private generateSourceMapFileName() {
    if (this.props.type === BundleType.CSS) {
      return `${this.props.name}.css.map`;
    }
    return `${this.props.name}.js.map`;
  }

  private generateFileName() {
    if (this.props.type === BundleType.CSS) {
      return `${this.props.name}.css`;
    }
    return `${this.props.name}.js`;
  }
  /**
   * Write bundle with sourcemaps if needed
   * @param withSourceMaps
   */
  private async write(withSourceMaps: boolean): Promise<IBundleWriteResponse> {
    const ctx = this.props.ctx;
    const ict = this.props.ctx.ict;
    ict.sync('before_bundle_write', { bundle: this });
    if (withSourceMaps) {
      const smData = ctx.writer.generate(this.generateSourceMapFileName(), this.contents.sourceMap);
      await smData.write();
      const file = path.basename(smData.relBrowserPath);
      this.contents.add(null, sourceMapsURL(file));
    }

    const bundleData = ctx.writer.generate(this.generateFileName(), this.contents.content.toString());
    await bundleData.write();
    ict.sync('after_bundle_write', { bundle: this });
    return { bundle: this, stat: bundleData };
  }

  /**
   * Generates a function that writes contents with sourcemaps
   */
  public generate() {
    const ctx = this.props.ctx;
    const config = ctx.config;

    const addSourceMaps = shouldAddSourcemaps(this.props.type, config);
    const content = this.contents.content.toString();
    return {
      write: (): Promise<IBundleWriteResponse> => this.write(addSourceMaps),
      contents: content,
      sourceMap: this.contents.sourceMap,
    };
  }
}

export function createBundle(props: IBundleProps) {
  return new Bundle(props);
}
