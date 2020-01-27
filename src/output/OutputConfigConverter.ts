import { existsSync } from 'fs';
import { env } from '../env';
import { ensureAbsolutePath } from '../utils/utils';
import {
  IOutputBundleConfig,
  IOutputBundleConfigAdvanced,
  IOutputConfig,
  IPublicOutputConfig,
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
  defaultRoot?: string;
  publicConfig?: IPublicOutputConfig;
}

export function outputConfigConverter(props: IOutputConfigProps): IOutputConfig {
  const userConfig = props.publicConfig;
  const config: IOutputConfig = {};

  if (userConfig) {
    if (userConfig.distRoot) config.distRoot = userConfig.distRoot;
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
      maxBundleSize: DEFAULT_MAX_BUNDLE_SIZE, // 100kb by default
      path: DEFAULT_VENDOR_PATH,
    };
  }
  if (!config.distRoot) config.distRoot = props.defaultRoot;

  config.distRoot = ensureAbsolutePath(config.distRoot, env.SCRIPT_PATH);

  if (!config.codeSplitting) {
    config.codeSplitting = { path: 'chunks/$name.$hash.js' };
  }

  return config;
}
