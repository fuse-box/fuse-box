export function getFolderEntryPointFromPackageJSON(json: any, isBrowserBuild?: boolean) {
  if (json.browser && isBrowserBuild === true && typeof json.browser === 'string') {
    return json.browser;
  }
  if (json.module) {
    return json.module;
  }
  if (json.tsMain) {
    return json.tsMain;
  }
  if (json['jsnext:main']) {
    return json['jsnext:main'];
  }
  return json.main || 'index.js';
}
