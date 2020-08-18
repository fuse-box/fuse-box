import * as path from 'path';
import { fileExists } from '../utils/utils';

const MAX_ITERATIONS = 20;

export function findTsConfig(props: { directory?: string; fileName?: string; root: string }): string {
  let current = props.fileName ? path.dirname(props.fileName) : props.directory;
  let iterations = 0;

  while (true) {
    let filePath = path.join(current, 'tsconfig.json');
    if (fileExists(filePath)) {
      return filePath;
    }
    if (props.root === current) return;
    // going backwards
    current = path.join(current, '..');
    // Making sure we won't have any perpetual loops here
    iterations = iterations + 1;
    if (iterations >= MAX_ITERATIONS) return;
  }
}
