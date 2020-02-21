import * as path from 'path';
import { ensureAbsolutePath, ensureDir, ensureFuseBoxPath, writeFile } from '../utils/utils';
/**
  outputParser is an indepenent enttity that accepts a user string
  e.g "./dist" or "./dist/app.js" or "./dist/app.$hash.js"

  it should return an object which will be used by Bundle objects in order to generate
  contents into the correct folders e.g.

  Bundle
    type : VENDOR
    writer


  output parser can be used to write resources too
*/
export interface IOuputParserProps {
  // throw an error if there is a file in the user string
  // e.g. "./dist/app.js" we want to enforce a directory only
  expectDirectory?: boolean;
  // hashes are enabled for production
  // otherwise they will be stripped from the string even specified
  hashEnabled?: boolean;
  root: string;
}

export function stripHash(str: string): string {
  return str.replace(/([-_.]+)?\$hash([-_.]+)?(\.\w+)$/, '$3').replace(/\$hash([-_.]+)?/, '');
}

export interface IDistWriterInitProps {
  fileName?: string;
  // will strip out the hash
  forceDisableHash?: boolean;
  hash?: string;
  publicPath?: string;
  // app.$name.js
  userString?: string;
}

export interface IDistWriteResponse {
  absPath: string;
  relativePath: string;
}

export interface DistWriter {
  outputDirectory: string;
  createWriter: (options: IDistWriterInitProps) => IWriterConfig;
  write: (target: string, contents: Buffer | string) => Promise<string>;
}

export interface IWriterConfig {
  absPath: string;
  browserPath: string;
  relativePath: string;
}

export function distWriter(props: IOuputParserProps): DistWriter {
  const root = props.root;

  const self = {
    outputDirectory: props.root,
    // create writer to get the information before the bundle is  written
    createWriter: (options: IDistWriterInitProps): IWriterConfig => {
      let userString = options.userString;
      let hash;

      if (!options.hash) {
        userString = stripHash(userString);
      } else {
        if (options.hash && !options.forceDisableHash) hash = options.hash;
        if (options.forceDisableHash) userString = stripHash(userString);
      }

      if (hash) userString = userString.replace(/\$hash/g, hash);
      if (userString.indexOf('$name') > -1) userString = userString.replace(/\$name/g, options.fileName);
      const absPath = ensureAbsolutePath(userString, root);
      const relativePath = ensureFuseBoxPath(path.relative(root, absPath));

      // fix non trailing slashes in configuration
      const sep = relativePath.charAt(0) !== '/' && options.publicPath && !options.publicPath.endsWith('/') ? '/' : '';
      const browserPath = options.publicPath ? options.publicPath + sep + relativePath : relativePath;

      return {
        absPath,
        browserPath,
        relativePath,
      };
    },
    // the actual write function
    write: async (target: string, contents: Buffer | string): Promise<string> => {
      if (!path.isAbsolute(target)) target = path.join(self.outputDirectory, target);
      ensureDir(path.dirname(target));
      await writeFile(target, contents);
      return target;
    },
  };
  return self;
}
