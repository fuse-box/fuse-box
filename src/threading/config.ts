import { homedir } from 'os';
import * as path from 'path';
import { ensureDir } from '../utils/utils';

const TheadingConfig = {
  getPIDSFolder: () => {
    const folder = path.join(homedir(), '.fuse-box/threading');
    ensureDir(folder);
    return folder;
  },
};
export { TheadingConfig };
