export const devStrings = {
  allowSyntheticDefaultImports: () => `FuseBox.sdep = true;`,
  target: (name: string) => `FuseBox.target = "${name}";`,
  reloadEntryOnStylesheet: (value: boolean) => `FuseBox.reloadEntryOnStylesheet = ${value};`,
  importFile: name => `FuseBox.import("${name}");`,
  processEnv: (vars: { [key: string]: string }) => `FuseBox.processEnv = ${JSON.stringify(vars)};`,
  setEntry: name => `FuseBox.main("${name}");`,
  openPackage: (name, conflicting: { [key: string]: string }) => {
    return `FuseBox.pkg("${name}", ${JSON.stringify(conflicting)}, function(___scope___){`;
  },
  openFile: (name: string) => {
    return `___scope___.file("${name}", function(exports, require, module){`;
  },
  closeFile: () => {
    return '});';
  },
  closePackage: (entry?: string) => {
    const contents = [];
    if (entry) {
      contents.push(`\t___scope___.entry = "${entry}";`);
    }
    contents.push('})');
    return contents.join('\n');
  },
};

export function sourceMapsURL(file: string) {
  return `//# sourceMappingURL=${file}`;
}
