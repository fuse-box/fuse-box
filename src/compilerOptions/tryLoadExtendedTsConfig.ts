import { parseTypescriptConfig } from './parseTypescriptConfig';
import * as path from 'path';

export const tryLoadExtendedTsConfig = (tsConfigDir: string, tsExtends: string) => {
    let extendedPath = path.resolve(tsConfigDir, tsExtends);
    let extendedConfig = parseTypescriptConfig(extendedPath);
    /**
     * If 'extends' references a tsconfig file in a 'node_module', the above will fail.
     * In this case, Trying using require.resolve to find the path to the tsconfig in
     * a 'node_module'.
     */
    if (extendedConfig.error) {
        extendedPath = require.resolve(tsExtends, { paths: [tsConfigDir, process.cwd()] });
        extendedConfig = parseTypescriptConfig(extendedPath);
    }
    return [extendedConfig, extendedPath] as const;
};
