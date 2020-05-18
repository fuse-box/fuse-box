import { IRawTypescriptConfig } from './interfaces';
import * as path from 'path';
import { tryLoadExtendedTsConfig } from './tryLoadExtendedTsConfig';

const merge = require('lodash.merge');

/**
 * Recursively loads the tsconfigs extended, and returns the resulting settings
 * merged sequentially.
 *
 * Does not mutate the original rawTsConfig.
 *
 * @param rawTsConfig The tsConfig result to load extended tsconfigs from.
 * @param tsConfigDirectory The directory containing 'rawTsConfig'.
 */
export const getExtendedTsConfig = (rawTsConfig: IRawTypescriptConfig, tsConfigDirectory: string): [IRawTypescriptConfig, string] | undefined => {

    if (!rawTsConfig.config) return [rawTsConfig, tsConfigDirectory];

    const tsConfig = rawTsConfig.config;

    if (!tsConfig.extends) return [rawTsConfig, tsConfigDirectory];

    const [extendedConfig, extendedPath] = tryLoadExtendedTsConfig(tsConfigDirectory, tsConfig.extends);

    /**
     * If we still have an error, then probably the extends path is wrong. Return the error.
     */
    if (extendedConfig.error) return [extendedConfig, extendedPath];

    const [resolvedBase, resolvedPath] = getExtendedTsConfig(extendedConfig, path.dirname(extendedPath));

    return [merge({}, resolvedBase, rawTsConfig), resolvedPath];
};

