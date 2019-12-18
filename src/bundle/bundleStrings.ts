export const devStrings = {
  allowSyntheticDefaultImports: () => `FuseBox.sdep = true;`,
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
  importFile: name => `FuseBox.import("${name}");`,
  openFile: (name: string) => {
    return `___scope___.file("${name}", function(exports, require, module){`;
  },
  openPackage: (name, conflicting: { [key: string]: string }) => {
    return `FuseBox.pkg("${name}", ${JSON.stringify(conflicting)}, function(___scope___){`;
  },
  processEnv: (vars: { [key: string]: string }) => `FuseBox.processEnv = ${JSON.stringify(vars)};`,
  reloadEntryOnStylesheet: (value: boolean) => `FuseBox.reloadEntryOnStylesheet = ${value};`,
  setEntry: name => `FuseBox.main("${name}");`,
  target: (name: string) => `FuseBox.target = "${name}";`,
};

export function sourceMapsURL(file: string) {
  return `//# sourceMappingURL=${file}`;
}

export function sourceMapsCSSURL(file: string) {
  return `/*# sourceMappingURL=${file} */`;
}
