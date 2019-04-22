import { ISassProps } from '../stylesheet/sassHandler';

export interface IStyleSheetProps {
  /**
   * e.g /public will re-write all URLS to have have /public/image.jpg instead of /image.jpg
   * Default value is "/resources"
   * @type {string}
   * @memberof IStyleSheetProps
   */
  resourcePublicRoot?: string;

  /**
   * A folder in the file system where the sources are copied
   * By providing a relative path e.g "public" FuseBox will join it with the current output Directory
   * it's possible to complelely override it by providing an absolute path;
   * Default value is : "{YOUR_DIST_FOLDER}/resources"
   * @type {string}
   * @memberof IStyleSheetProps
   */
  resourceFolder?: string;

  /**
   * By default, FuseBox checks if a file has been copied over and exists in the dest file.
   * That saves some time on bunlding, but also ignores a modified resource (for example an image with the same name)
   * Toggle this on if you work images that are copied over and over again with the same name
   * @type {boolean}
   * @memberof IStyleSheetProps
   */
  ignoreChecksForCopiedResources?: boolean;

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
   * Path lookup. Simpilar to the ones most CSS preprocessor provide
   * It's recommended to use macro option instead as this options adds additional overhead
   *
   * @type {Array<string>}
   * @memberof IStyleSheetProps
   */
  paths?: Array<string>;

  /**
   * Helps to resolve urls and untangle the paths
   * e.g provide `{ $src : path.join(__dirname, "src")}`
   * in order to use `@import "$src/some.scss"` or `background-image: url("$src/images/logo.png")`
   * Replaces values "as is" therefore you should take care of preffixes. Giving it just a string "src" or "a" will result
   * in replacing all values in the string and breaking the path.
   * @type {{ [key: string]: string }}
   * @memberof IStyleSheetProps
   */
  macros?: { [key: string]: string };
  sass?: ISassProps;
}
