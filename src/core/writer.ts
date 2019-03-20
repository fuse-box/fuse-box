import * as path from 'path';
import { ensureAbsolutePath, ensureFuseBoxPath, fastHash, writeFile } from '../utils/utils';
import { env } from './env';

export interface IWriter {}
export interface IWriterProps {
  output?: string;
  isProduction?: boolean;
  root?: string;
}

export interface IWriterResponse {
  size: number;
  localPath: string;
  absPath: string;
  relBrowserPath: string;
  write: () => void;
}

export interface IWriterActions {
  outputDirectory: string;
  template: string;
  generate: (name: string, contents) => IWriterResponse;
}

/**
 * Writes data to the file system
 * Fully detached from the context
 * @param props
 */
export function writer(props: IWriterProps): IWriterActions {
  const outputString = props.output ? props.output : props.isProduction ? 'dist/$name-$hash' : 'dist/$name';

  const outputDirectory = ensureAbsolutePath(path.dirname(outputString), props.root || env.APP_ROOT);
  let template = path.basename(outputString);
  if (!props.isProduction) {
    // we don't allow hashes for development for known reasons
    template = template.replace(/\$([-_.]+)?hash([-_.]+)?/, '');
  }
  return {
    outputDirectory,
    // generated template
    template,
    // generate first, then write
    // this is done to simplify work when we need to know all the paths before the file is written
    // in case of the sourcemaps for example
    generate: (name: string, contents): IWriterResponse => {
      const targetFileName = path.basename(name);
      const [$name, $ext] = targetFileName.split(/(\.[a-z-0-9]+)$/);
      const targetBaseDir = path.dirname(name);
      const opts = {
        hash: props.isProduction ? fastHash(contents) : false,
      };
      let localPath = template.replace('$name', $name);
      if (typeof opts.hash === 'string') {
        localPath = localPath.replace('$hash', opts.hash);
      }
      localPath = path.join(targetBaseDir, `${localPath}${$ext}`);
      const absPath = path.join(outputDirectory, localPath);
      const relBrowserPath = ensureFuseBoxPath(path.relative(outputDirectory, absPath));
      const size = Buffer.byteLength(contents, 'utf8');
      return {
        size,
        localPath,
        absPath,
        relBrowserPath,
        write: async () => writeFile(absPath, contents),
      };
    },
  };
}
