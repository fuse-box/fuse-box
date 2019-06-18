export interface IResourceConfig {
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
}
