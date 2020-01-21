export function sourceMapsURL(file: string) {
  return `//# sourceMappingURL=${file}`;
}

export function sourceMapsCSSURL(file: string) {
  return `/*# sourceMappingURL=${file} */`;
}
