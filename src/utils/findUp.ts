import { existsSync, statSync } from 'fs';
import { dirname, join } from 'path';

export const FIND_UP_GLOBAL_CONFIG = {
  maxStepsBack: 10,
};

export function findUp(
  start: string,
  target: string,
  boundaryArg?: {
    boundary: string;
    inclusive: boolean;
  },
): null | string {
  let currentDir = start;
  try {
    const stat = statSync(start);
    currentDir = stat.isDirectory() ? start : dirname(start);
  } catch (err) {}

  let lastTry = false;
  let backSteps = 0;
  while (backSteps++ <= FIND_UP_GLOBAL_CONFIG.maxStepsBack) {
    if (boundaryArg && boundaryArg.boundary.includes(currentDir)) {
      if (boundaryArg.inclusive && lastTry === false) {
        lastTry = true;
      } else {
        return null;
      }
    }

    const targetTestPath = join(currentDir, target);
    if (existsSync(targetTestPath)) {
      return targetTestPath;
    }

    currentDir = join(currentDir, '../');
  }

  console.error(`Too many back steps, starting from "${start}"`);
  return null;
}
