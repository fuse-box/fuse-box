import { Context } from '../../core/context';
import { IModule } from '../../moduleResolver/module';
import { fileExists, fastHash, getFilename, listDirectory, pathJoin, pathRelative } from '../../utils/utils';

export function pluginNodeNativeHandler(module: IModule) {
  const target = module.absPath;
  const packageRoot = module.pkg.meta.packageRoot;
  const relativeTarget = pathRelative(packageRoot, target);
  const locationPrefix = pathJoin('./node-native', fastHash(packageRoot));
  const fileLocation = pathJoin(locationPrefix, relativeTarget);
  const fileDestination = pathJoin(module.ctx!.writer!.outputDirectory, fileLocation);

  module.captured = true;
  module.ctx.log.info('node-native', 'Captured $file with pluginNodeNative', {
    file: target,
  });

  if (!fileExists(fileDestination)) {
    module.ctx.taskManager.copyFile(target, fileDestination);
  }

  module.contents = `module.exports = require("./${fileLocation.replace(/\\/gi, '/')}");`;

  // Scan all package directories for .so and .dll libraries and copy them to the output
  listDirectory(packageRoot)
    .filter(filepath => {
      return /\.dll|\.so$|\.so\./.test(getFilename(filepath));
    })
    .forEach(filepath => {
      const filename = pathRelative(packageRoot, filepath);
      const libDestination = pathJoin(module.ctx.writer.outputDirectory, locationPrefix, filename);
      if (!fileExists(libDestination)) {
        module.ctx.taskManager.copyFile(filepath, libDestination);
      }
    });
}

export function pluginNodeNative() {
  return (ctx: Context) => {
    ctx.ict.on('bundle_resolve_module', props => {
      if (!props.module.captured && props.module.extension === '.node') {
        pluginNodeNativeHandler(props.module);
      }
      return props;
    });
  };
}
