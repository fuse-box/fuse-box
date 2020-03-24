export interface IPublicOutputConfig {
  /**
   * The same as development and will be copied here unless the field is specified
   * Hashes are supported
   *
   * {
   *   app : "./app.$hash.js",
   *   vendor : "./vendor.$name.js"
   * }
   *
   * In addition you can do custom mapping to create additional bundles
   * {
   *    mapping : [
   *       matching : "moment*",
   *       target : "./vendor.moment.$hash.hs"
   *    ]
   * }
   *
   * Or with mapping and exposure
   * {
   *    mapping : [
   *       matching : "moment*",
   *       target : {
   *          bundle : "./vendor.moment.$hash.js",
   *          windowExposure : {
   *            fuseBoxPath : "moment/index",
   *            exposedVariableName : "moment"
   *          }
   *       }
   *    ]
   * }
   */
  app?: IOutputBundleConfig;
  codeSplitting?: ICodeSplittingProps;
  cssSplitting?: boolean;
  /**
   * distRoot is essential when making custom configuration
   * That's how we determine relative paths for webIndex (index.html)
   */
  distRoot?: string;
  exported?: boolean;
  mapping?: Array<{
    matching: string;
    target: IOutputBundleConfig;
  }>;
  serverEntry?: string;
  styles?: IOutputBundleConfig;
  vendor?: IOutputBundleConfig;
}

export interface IOutputBundleConfigAdvanced {
  codeSplitting?: ICodeSplittingProps;
  /**
   * Isolated API works only for one bundle output.
   * e,g app : "./target.build.js"
   * And would mean that FuseBox will make an inclosed environment where
   * the API will have access to the outside world (window)
   * This is usually the case when making WebWorker bundles / browser builds for libraries
   */
  isolatedApi?: boolean;
  maxBundleSize?: number;
  path: string;
  // defaults to "/"
  publicPath?: string;
}

/**
 *  target bundle name could be a string or an advanced configuration
 *  with target and exposed objects
 */
export type IOutputBundleConfig = IOutputBundleConfigAdvanced | string;

export interface ICodeSplittingProps {
  path?: string;
  publicPath?: string;
}

export interface IOutputConfig {
  app?: IOutputBundleConfigAdvanced;
  codeSplitting?: ICodeSplittingProps;
  cssSplitting?: boolean;
  distRoot?: string;
  exported?: boolean;
  mapping?: Array<{
    matching: string;
    target: IOutputBundleConfigAdvanced;
  }>;
  serverEntry?: string;
  styles?: IOutputBundleConfigAdvanced;
  vendor?: IOutputBundleConfigAdvanced;
}
