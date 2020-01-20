import * as path from 'path';
import { fastHash, path2RegexPattern, ensureDir, ensureFuseBoxPath, writeFile } from '../utils/utils';
import { IBundleType, IBundle } from '../bundle_new/Bundle';
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
  root: string;

  // hashes are enabled for production
  // otherwise they will be stripped from the string even specified
  hashEnabled?: boolean;
  // throw an error if there is a file in the user string
  // e.g. "./dist/app.js" we want to enforce a directory only
  expectDirectory?: boolean;
}

function stripHash(template): string {
  return template.replace(/([-_.]+)?\$hash([-_.]+)?/, '');
}

export interface IDistWriterInitProps {
  contents: string | Buffer;
  // app.$name.js
  userString?: string;
  hash?: boolean;
  // will strip out the hash
  forceDisableHash?: boolean;
}

export interface IDistWriteResponse {
  absPath: string;
  relativePath: string;
}
export function distWriter(props: IOuputParserProps) {
  const root = props.root;

  const self = {
    // the actual write function
    write: async (path: string, contents: string | Buffer) => writeFile(path, contents),
    // create writer to get the information before the bundle is  written
    createWriter: (options: IDistWriterInitProps) => {
      let userString = options.userString;
      let hash;

      if (options.hash && !options.forceDisableHash) hash = fastHash(options.contents.toString());
      if (options.forceDisableHash) userString = stripHash(userString);
      if (hash) userString.replace(/\$hash/, hash);

      const absPath = path.join(root, userString);
      const targetFolder = path.dirname(absPath);

      const relativePath = ensureFuseBoxPath(path.relative(root, absPath));
      return {
        absPath,
        relativePath,
        write: async () => {
          ensureDir(targetFolder);
          await self.write(absPath, options.contents);
          return { absPath, relativePath };
        },
      };
    },
  };
  return self;
}

export type IDistWriter = ReturnType<typeof distWriter>;
