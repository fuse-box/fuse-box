import * as path from 'path';
import { env } from '../env';
import { ensureAbsolutePath, ensureFuseBoxPath, fastHash, writeFile } from '../utils/utils';

export interface IWriter {}
export interface IWriterProps {
  isProduction?: boolean;
  output?: string;
  root?: string;
}

export interface IWriterResponse {
  absPath: string;
  localPath: string;
  relBrowserPath: string;
  size: number;
  write: (content?: string) => void;
}

export interface IWriterActions {
  outputDirectory: string;
  template: string;
  generate: (name: string, contents, noHash?: boolean) => IWriterResponse;
  write: (target: string, content: string) => Promise<{ target: string }>;
}

function stripHash(template): string {
  return template.replace(/([-_.]+)?\$hash([-_.]+)?/, '');
}
/**
 * Writes data to the file system
 * Fully detached from the context
 * @param props
 */

export function createWriter(props: IWriterProps): IWriterActions {
  let outputString = props.output ? props.output : props.isProduction ? 'dist/$hash-$name' : 'dist/$name';

  // make sure it has $name in the template
  if (!/\$name/.test(outputString)) {
    if (/\/$/.test(outputString)) {
      outputString += '$name';
    } else {
      outputString += '/$name';
    }
  }

  const outputDirectory = ensureAbsolutePath(path.dirname(outputString), props.root || env.APP_ROOT);

  let template = path.basename(outputString);
  if (!props.isProduction) {
    // we don't allow hashes for development for known reasons
    template = stripHash(template);
  }
  return {
    outputDirectory,
    // generated template
    template,
    // generate first, then write
    // this is done to simplify work when we need to know all the paths before the file is written
    // in case of the sourcemaps for example
    generate: (name: string, contents, skipHash?): IWriterResponse => {
      const targetFileName = path.basename(name);
      const [$name, $ext] = targetFileName.split(/(\.[a-z-0-9]+)$/);
      const targetBaseDir = path.dirname(name);
      const opts = {
        hash: props.isProduction ? fastHash(contents) : false,
      };
      let localPath = template.replace('$name', $name);

      if (skipHash) {
        localPath = stripHash(localPath);
      } else if (typeof opts.hash === 'string') {
        localPath = localPath.replace('$hash', opts.hash);
      }
      localPath = path.join(targetBaseDir, `${localPath}${$ext}`);
      const absPath = path.join(outputDirectory, localPath);

      const relBrowserPath = ensureFuseBoxPath(path.relative(outputDirectory, absPath));
      const size = Buffer.byteLength(contents, 'utf8');

      return {
        absPath,
        localPath,
        relBrowserPath,
        size,
        write: async (cnt?: string) => {
          // piping the contents to webIndex instead
          await writeFile(absPath, cnt ? cnt : contents);
        },
      };
    },
    write: async (target: string, contents: string) => {
      if (!path.isAbsolute(target)) {
        target = path.join(outputDirectory, target);
      }
      await writeFile(target, contents);
      return {
        target,
      };
    },
  };
}
