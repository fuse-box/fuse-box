export function wrapContents(contents: any, useDefault: boolean) {
  return `${useDefault ? 'module.exports.default' : 'module.exports'} = ${contents};`;
}
