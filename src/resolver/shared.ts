export function getFolderEntryPointFromPackageJSON(props: {
  isBrowserBuild?: boolean;
  json: any;
  useLocalField?: boolean;
}) {
  if (isBrowserEntry(props.json, props.isBrowserBuild)) {
    return props.json.browser;
  }

  if (props.useLocalField && props.json['local:main']) {
    return props.json['local:main'];
  }

  if (props.json['ts:main']) {
    return props.json['ts:main'];
  }
  // if (props.json.esm5) {
  //   return props.json.esm5;
  // }
  // if (props.json.esm2015) {
  //   return props.json.esm2015;
  // }
  if (props.json.module) {
    return props.json.module;
  }

  return props.json.main || 'index.js';
}

export function isBrowserEntry(json: any, isBrowserBuild?: boolean) {
  return json.browser && isBrowserBuild === true && typeof json.browser === 'string';
}
