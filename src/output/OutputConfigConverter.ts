import {
  IPublicOutputConfig,
  IOutputConfig,
  IOutputBundleConfigAdvanced,
  IOutputBundleConfig,
} from './OutputConfigInterface';

const DEFAULT_APP_PATH = 'app.$hash.js';
const DEFAULT_VENDOR_PATH = 'vendor.$hash.js';
const DEFAULT_MAX_BUNDLE_SIZE = 100000; // 100kb

function ensureBundleConfig(input: IOutputBundleConfig): IOutputBundleConfigAdvanced {
  if (typeof input === 'string')
    return {
      path: input,
    };
  return input;
}

export interface IOutputConfigProps {
  publicConfig?: IPublicOutputConfig;
  defaultRoot?: string;
}

export function outputConfigConverter(props: IOutputConfigProps): IOutputConfig {
  const userConfig = props.publicConfig;
  const config: IOutputConfig = {};

  if (userConfig) {
    if (userConfig.root) config.root = userConfig.root;
    config.app = userConfig.app ? ensureBundleConfig(userConfig.app) : { path: DEFAULT_APP_PATH };

    if (userConfig.vendor) config.vendor = ensureBundleConfig(userConfig.vendor);

    if (userConfig.mapping) {
      config.mapping = [];
      for (const item of userConfig.mapping) {
        config.mapping.push({
          matching: item.matching,
          target: ensureBundleConfig(item.target),
        });
      }
    }
    if (userConfig.cssSplitting !== undefined) config.cssSplitting = userConfig.cssSplitting;
  } else {
    // creating default config
    config.app = { path: DEFAULT_APP_PATH };
    config.vendor = {
      path: DEFAULT_VENDOR_PATH,
      maxBundleSize: DEFAULT_MAX_BUNDLE_SIZE, // 100kb by default
    };
  }
  if (!config.root) config.root = props.defaultRoot;

  if (!config.codeSplitting) {
    config.codeSplitting = { path: 'chunks/$name.$hash.js' };
  }

  return config;
}
