export function wrapContents(contents: any, useDefault: boolean) {
  return `${
    useDefault
      ? 'Object.defineProperty(exports, "__esModule", { value: true });\nmodule.exports.default'
      : 'module.exports'
  } = ${contents};`;
}
