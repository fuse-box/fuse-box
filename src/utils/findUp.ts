import { join, dirname } from 'path';
import { existsSync, statSync } from 'fs';

export const FIND_UP_GLOBAL_CONFIG = {
	maxStepsBack: 50
};

export function findUp(start: string, target: string, boundaryArg?: {
	boundary: string,
	inclusive: boolean,
}): string | null {
	const { isDirectory } = statSync(start);
	let currentDir = isDirectory ? start : dirname(start);
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

		currentDir = join(currentDir, "../");
	}

	console.error(`Too many back steps, starting from "${start}"`);
	return null;
}
