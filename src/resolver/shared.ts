export function getFolderEntryPointFromPackageJSON(json: any, isBrowserBuild?: boolean) {
  if (isBrowserEntry(json, isBrowserBuild)) {
    return json.browser;
  }
  if (json.module) {
    return json.module;
  }
  if (json['ts:main']) {
    return json['ts:main'];
  }

  return json.main || 'index.js';
}

export function isBrowserEntry(json: any, isBrowserBuild?: boolean) {
  return json.browser && isBrowserBuild === true && typeof json.browser === 'string';
}
