export function aggregatePlugins(plugins: any[]): any[] {
  return plugins.filter((plugin) => plugin !== false)
}
