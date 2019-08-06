import { IProductionFlow } from '../main';
import { IBundleWriteResponse, BundleType } from '../../bundle/Bundle';
import { IManifestJSON } from '../../config/IManifest';
import { writeFile } from '../../utils/utils';

export function manifestStage(props: IProductionFlow, bundles: Array<IBundleWriteResponse>) {
  const log = props.ctx.log;
  const config = props.ctx.config;
  log.progress('<dim><bold>- Manifest stage</bold></dim>');

  const json: IManifestJSON = {
    bundles: [],
  };
  bundles.forEach(bundle => {
    json.bundles.push({
      type: BundleType[bundle.bundle.props.type],
      size: bundle.stat.size,
      absPath: bundle.stat.absPath,
      localPath: bundle.stat.localPath,
      name: bundle.bundle.name,
      priority: bundle.bundle.props.priority,
      relBrowserPath: bundle.stat.relBrowserPath,
      webIndexed: bundle.bundle.props.webIndexed,
    });
  });
  log.progressFormat('manifest', config.manifest.filePath);

  log.progressEnd('<green><bold>$checkmark Manifest generated</bold></green>');
  writeFile(config.manifest.filePath, JSON.stringify(json, null, 2));
}
