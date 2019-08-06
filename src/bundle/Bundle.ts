import * as path from 'path';
import { Context } from '../core/Context';
import { Package } from '../core/Package';
import { IWriterResponse } from '../core/writer';
import { Concat, createConcat } from '../utils/utils';
import { sourceMapsCSSURL, sourceMapsURL } from './bundleStrings';

/**
 * Bundle types with priorities
 * The numbers should not be changed
 */
export enum BundleType {
  CSS = 1,
  DEV = 2,
  VENDOR_JS = 3,
  PROJECT_JS = 4,
  PROJECT_ENTRY = 5,
  SERVER_ENTRY = 6,
  SPLIT_JS = 7,
}

/**
 * Mapped bundle names
 * Those could be changed it's mainly used for development
 */
export const BundleNames = {
  [BundleType.CSS]: 'styles',
  [BundleType.DEV]: 'dev',
  [BundleType.PROJECT_JS]: 'app',
  [BundleType.PROJECT_ENTRY]: 'entry',
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
  const bundleName = `${ctx.getUniqueEntryHash()}${BundleNames[type]}`;

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

export class Bundle {
  public packages: Array<Package>;
  // the only bundle in the project
  public isolated?: boolean;
  public contents: Concat;

  public noHash?: boolean;
  public name: string;
  private useCustomGenerator: boolean;

  constructor(public props: IBundleProps) {
    this.packages = [];
    this.name = props.name;
    this.contents = createConcat(true, this.name, '\n');
  }

  public flush() {
    this.contents = createConcat(true, this.name, '\n');
  }

  public prependContent(contents: string, sm?: string) {
    const prev = this.contents;
    this.contents = createConcat(true, this.name, '\n');
    this.contents.add(null, contents, sm);
    this.contents.add(null, prev.content, prev.sourceMap);
  }

  public setCustomName(name: string) {
    this.name = name;
    this.useCustomGenerator = true;
  }
  public addContent(contents: string | Buffer, sm?) {
    this.contents.add(null, contents, sm);
  }

  public addConcat(concat: Concat) {
    this.contents.add(null, concat.content, concat.sourceMap);
  }

  public override(contents: string, sm) {
    this.contents = createConcat(true, this.name, '\n');
    this.contents.add(null, contents, sm);
  }

  public addPackage(pkg: Package) {
    this.packages.push(pkg);
  }

  public isJavascriptType() {
    return (
      this.props.type === BundleType.PROJECT_JS ||
      this.props.type === BundleType.VENDOR_JS ||
      this.props.type === BundleType.SPLIT_JS
    );
  }

  public needsSourceMaps() {
    if (this.props.type === BundleType.PROJECT_JS || this.props.type === BundleType.SPLIT_JS) {
      return this.props.ctx.config.sourceMap.project;
    }
    if (this.props.type === BundleType.VENDOR_JS) {
      return this.props.ctx.config.sourceMap.vendor;
    }
    if (this.props.type === BundleType.CSS) {
      return this.props.ctx.config.sourceMap.css;
    }
    return true;
  }

  private generateSourceMapFileName() {
    if (this.props.type === BundleType.CSS) {
      return `${this.name}.css.map`;
    }
    return `${this.name}.js.map`;
  }

  public getFileName() {
    if (this.props.type === BundleType.CSS) {
      return `${this.name}.css`;
    }
    return `${this.name}.js`;
  }
  /**
   * Write bundle with sourcemaps if needed
   * @param withSourceMaps
   */
  private async write(withSourceMaps: boolean): Promise<IBundleWriteResponse> {
    const ctx = this.props.ctx;
    const ict = this.props.ctx.ict;
    ict.sync('before_bundle_write', { bundle: this });
    let writeBundles = true;
    if (!ctx.webIndex.isDisabled) {
      if (ctx.config.webIndex && ctx.config.webIndex.embedIndexedBundles && ctx.config.production) {
        withSourceMaps = false;
        writeBundles = this.props.webIndexed ? false : true;
      }
    }

    if (withSourceMaps && this.contents.sourceMap) {
      const smData = ctx.writer.generate(this.generateSourceMapFileName(), this.contents.sourceMap);
      await smData.write();
      const file = path.basename(smData.relBrowserPath);
      this.contents.add(null, this.props.type === BundleType.CSS ? sourceMapsCSSURL(file) : sourceMapsURL(file));
    }

    const bundleData = ctx.writer.generate(this.getFileName(), this.contents.content.toString(), this.noHash);
    if (writeBundles) await bundleData.write();
    ict.sync('after_bundle_write', { bundle: this });
    return { bundle: this, stat: bundleData };
  }

  /**
   * Generates a function that writes contents with sourcemaps
   */
  public generate() {
    const addSourceMaps = this.needsSourceMaps(); //shouldAddSourcemaps(this.props.type, config);
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
