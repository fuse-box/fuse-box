export interface IManifest {
  details?: boolean;
  enabled?: boolean;
  filePath?: string;
}

export interface IManifestBundle {
  absPath: string;
  localPath: string;
  name: string;
  priority: number;
  relBrowserPath: string;
  size: number;
  type: string;
  webIndexed: boolean;
}
export interface IManifestJSON {
  bundles: Array<IManifestBundle>;
}
