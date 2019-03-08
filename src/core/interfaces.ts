export interface IConfig {
  root?: string;
  target?: 'browser' | 'server' | 'electron' | 'universal';
  homeDir?: string;
  output?: string;
  modules?: Array<string>;
  fuseBoxPolyfillsFolder?: string;

  // read only
  defaultCollectionName?: string;
}
