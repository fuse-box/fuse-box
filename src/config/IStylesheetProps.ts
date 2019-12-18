import { ISassProps } from '../stylesheet/sassHandler';
import { IPostCSSProps } from './IPostCSSProps';
import { IResourceConfig } from './IResourceConfig';

import { ILessProps } from './ILessProps';

export interface IStyleSheetAutoImportCapture {
  capture?: RegExp | string;
  file: string;
}

export interface IStyleSheetProps extends IResourceConfig {
  /**
   * By default, FuseBox checks if a file has been copied over and exists in the dest file.
   * That saves some time on bundling, but also ignores a modified resource (for example an image with the same name)
   * Toggle this on if you work images that are copied over and over again with the same name
   * @type {boolean}
   * @memberof IStyleSheetProps
   */
  ignoreChecksForCopiedResources?: boolean;

  /**
   * If toggled all stylesheet module will break its dependant cache and will be forced to be reloaded
   *
   * @type {boolean}
   * @memberof IStyleSheetProps
   */
  breakDependantsCache?: boolean;

  /**
   * Files will be grouped in folder by type
   * e.g images.jpg will go into "resources/images/image.jpg"
   * font.ogg will go into "resources/fonts/font.ogg"
   * Default value is "true"
   * @type {boolean}
   * @memberof IStyleSheetProps
   */
  groupResourcesFilesByType?: boolean;

  /**
   * Path lookup. Similar to the ones most CSS preprocessor provide
   * It's recommended to use macro option instead as this options adds additional overhead
   *
   * @type {Array<string>}
   * @memberof IStyleSheetProps
   */
  paths?: Array<string>;

  /**
   * Auto import resources at paths
   */
  autoImport?: Array<IStyleSheetAutoImportCapture>;

  /**
   * Helps to resolve urls and untangle the paths
   * e.g provide `{ $src : path.join(__dirname, "src")}`
   * in order to use `@import "$src/some.scss"` or `background-image: url("$src/images/logo.png")`
   * Replaces values "as is" therefore you should take care of prefixes. Giving it just a string "src" or "a" will result
   * in replacing all values in the string and breaking the path.
   * @type {{ [key: string]: string }}
   * @memberof IStyleSheetProps
   */
  less?: ILessProps;
  postCSS?: IPostCSSProps;
  sass?: ISassProps;
  macros?: { [key: string]: string };
}
