export interface ICodeSplittingConfig {
  scriptRoot?: string;

  /**
   * limit the filename to the last portion of the input path if total length exceeded.
   * 
   * For example Import('./site/about/about.module').then(m => m.AboutModule) would yield
   *    (20) => 'about.module.js'
   *    (0) =>  'site-about-about.module.js'
   * 
   * default: 20
   */
  maxPathLength?: number;

  /**
   * Prefix the lazy loaded module with a hash of the file contents.
   * 
   * For example Import('./site/about/about.module').then(m => m.AboutModule) would yield
   *    (true) => '016ee59f7-site-about-about.module.js'
   *    (false) =>  'site-about-about.module.js'
   * 
   * default: true
   */
  useHash?: boolean;
}
