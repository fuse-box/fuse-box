export interface IManifest {
  enabled?: boolean;
  filePath?: string;
  details?: boolean;
}

export interface IManifestBundle {
  type: string;
  name: string;
  size: number;
  localPath: string;
  absPath: string;
  relBrowserPath: string;
  webIndexed: boolean;
  priority: number;
}
export interface IManifestJSON {
  bundles: Array<IManifestBundle>;
}
