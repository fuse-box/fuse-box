export const JS_EXTENSIONS = ['.js', '.jsx', '.mjs'];
export const TS_EXTENSIONS = ['.ts', '.tsx'];
export const EXECUTABLE_EXTENSIONS = [...JS_EXTENSIONS, ...TS_EXTENSIONS];
export const FONT_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2', '.eot'];
export const IMAGE_EXTENSIONS = ['.png', '.jpeg', '.jpg', '.gif', '.bmp', '.svg'];
export const ICO_EXTENSIONS = ['.ico'];
export const STYLESHEET_EXTENSIONS = ['.css', '.scss', '.sass', '.less', '.styl'];
export const DOCUMENT_EXTENSIONS = ['.pdf'];
export const LINK_ASSUMPTION_EXTENSIONS = [
  ...FONT_EXTENSIONS,
  ...IMAGE_EXTENSIONS,
  ...ICO_EXTENSIONS,
  ...DOCUMENT_EXTENSIONS,
];
export const TEXT_EXTENSIONS = ['.md', '.txt', '.html', '.graphql'];
export const FTL_ELIGIBLE_EXTENSIONS = [...TEXT_EXTENSIONS, ...STYLESHEET_EXTENSIONS];
