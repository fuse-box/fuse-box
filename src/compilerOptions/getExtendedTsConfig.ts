import { IRawTypescriptConfig } from './interfaces';
import { parseTypescriptConfig } from './parseTypescriptConfig';
import merge from 'lodash.merge';
import path, { dirname } from 'path';

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

    let extendedPath = path.resolve(tsConfigDirectory, tsConfig.extends);
    let extendedConfig = parseTypescriptConfig(extendedPath);

    /**
     * If 'extends' references a tsconfig file in a 'node_module', the above will fail.
     * In this case, Trying using require.resolve to find the path to the tsconfig in
     * a 'node_module'.
     */
    if (extendedConfig.error) {
        extendedPath = require.resolve(tsConfig.extends);
        extendedConfig = parseTypescriptConfig(extendedPath);
    }

    /**
     * If we still have an error, then probably the extends path is wrong. Return the error.
     */
    if (extendedConfig.error) return [extendedConfig, extendedPath];

    const [resolvedBase, resolvedPath] = getExtendedTsConfig(extendedConfig, dirname(extendedPath));

    return [merge({}, resolvedBase, rawTsConfig), resolvedPath];
};
