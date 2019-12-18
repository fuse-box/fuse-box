import { ensureAbsolutePath, fileExists, getExtension, makeFuseBoxPath } from '../utils/utils';
import { Context } from './Context';
import { Module } from './Module';
import { Package, IPackageProps } from './Package';

export function createApplicationPackage(ctx: Context, entryFile: string): Package {
  const absPath = ensureAbsolutePath(entryFile, ctx.config.homeDir);

  if (!fileExists(absPath)) {
    ctx.fatal('Your entry point was not found', [
      `You have set the following entry point <yellow>${entryFile}</yellow>`,
      `We tried <underline>${absPath}</underline>`,
    ]);
  }
  const fuseBoxPath = makeFuseBoxPath(ctx.config.homeDir, absPath);
  const extension = getExtension(absPath);
  const pkg = createDefaultPackage(ctx);
  const module = new Module(
    {
      absPath,
      ctx,
      extension,
      fuseBoxPath,
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
