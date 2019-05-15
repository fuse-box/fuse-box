import { ensureAbsolutePath, getExtension, makeFuseBoxPath, fileExists } from '../utils/utils';
import { Context } from './Context';
import { Module } from './Module';
import { IPackageProps, Package } from './Package';

export function createApplicationPackage(ctx: Context, entryFile: string): Package {
  const absPath = ensureAbsolutePath(entryFile, ctx.config.homeDir);
  if (!fileExists(absPath)) {
    ctx.log.error('Entry "$entry" was not found. Tried: $file', { entry: entryFile, file: absPath });
    return;
  }
  const fuseBoxPath = makeFuseBoxPath(ctx.config.homeDir, absPath);
  const extension = getExtension(absPath);
  const pkg = createDefaultPackage(ctx);
  const module = new Module(
    {
      ctx,
      fuseBoxPath,
      absPath,
      extension,
    },
    pkg,
  );
  pkg.setEntry(module);
  return pkg;
}

export function createDefaultPackage(ctx: Context): Package {
  const props: IPackageProps = {
    ctx: ctx,
    meta: {
      name: ctx.config.defaultCollectionName,
    },
  };
  const pkg = new Package(props);
  pkg.isFlat = true;
  pkg.isDefaultPackage = true;
  return pkg;
}
