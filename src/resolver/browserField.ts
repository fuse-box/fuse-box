import * as path from 'path';
import { fileExists } from '../utils/utils';
import { IPackageMeta } from './resolver';
export function handleBrowserField(packageMeta: IPackageMeta, absPath: string): string {
  if (typeof packageMeta.browser !== 'object') {
    return;
  }

  for (const key in packageMeta.browser) {
    const targetValue = packageMeta.browser[key];
    if (typeof targetValue === 'string') {
      if (path.extname(key) === '.js') {
        const targetAbsPath = path.join(packageMeta.packageRoot, key);
        if (fileExists(targetAbsPath) && absPath === targetAbsPath) {
          return path.join(path.join(packageMeta.packageRoot, targetValue));
        }
      }
    }
  }
}
